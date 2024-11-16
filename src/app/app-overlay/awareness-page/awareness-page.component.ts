import { Component, isDevMode, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { QuotesWidgetComponent } from "../overlay-widgets/quotes-widget/quotes-widget.component";
import { WebsitesService } from "../services/websites/websites.service";
import { BreathingWidgetComponent } from "../overlay-widgets/breathing-widget/breathing-widget.component";
import { TasksWidgetComponent } from "../overlay-widgets/tasks-widget/tasks-widget.component";

@Component({
  selector: "app-awareness-page",
  standalone: true,
  imports: [CommonModule, QuotesWidgetComponent, BreathingWidgetComponent, TasksWidgetComponent],
  templateUrl: "./awareness-page.component.html",
  styleUrls: ["./awareness-page.component.css"],
})
export class AwarenessPageComponent implements OnInit {
  originalTimerValue!: number;
  timerValue = signal(30);
  outputUrl!: URL;
  widget = "Quotes";

  constructor(
    private route: ActivatedRoute,
    private websitesService: WebsitesService,
  ) {
    this.getPageWidget().then(widget => {
      this.widget = widget;
    });

    websitesService.getTimerValue(this.outputUrl.host).then(timer => {
      this.originalTimerValue = timer;
      this.timerValue.set(timer);
      this.countdown();
    });
  }

  ngOnInit(): void {
    const urlParam = this.route.snapshot.paramMap.get("outputURL");
    if (urlParam) this.outputUrl = new URL(atob(decodeURIComponent(urlParam)));

    isDevMode() && console.log("Output url:", this.outputUrl);
  }

  countdown() {
    if (this.timerValue() > 0) {
      setTimeout(() => {
        if (document.hasFocus() && !document.hidden) {
          this.timerValue.update(value => value - 1);
        } else {
          this.timerValue.set(this.originalTimerValue); // If the user is not on the tab, we restart the timer
        }
        this.countdown();
      }, 1100); // Yes, it's more than 1s
    } else {
      !isDevMode() && this.waitBeforeClose();
    }
  }

  private waitBeforeClose() {
    setTimeout(() => {
      window.close();
    }, 5 * 1000);
  }

  // This means failure as the user has waited for the timer to expire
  skipTimer() {
    this.websitesService.allowWebsiteTemporary();
    window.location.href = this.outputUrl.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    setTimeout(() => {
      window.close();
    }, 250);
  }

  private async getPageWidget() {
    const result = await chrome.storage.sync.get("awarenessPageWidget");
    const widget: string = result["awarenessPageWidget"] || "Quotes";
    return widget === "Random" ? this.getRandomWidget() : widget;
  }

  private getRandomWidget() {
    const widgets = ["Quotes", "Breathing", "Tasks"];
    const randomIndex = Math.floor(Math.random() * widgets.length);
    return widgets[randomIndex];
  }
}
