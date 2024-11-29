import { CommonModule } from "@angular/common";
import { Component, inject, isDevMode, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getAwarenessPageWidget } from "app/shared/chrome-storage-api";
import { BreathingWidgetComponent } from "../overlay-widgets/breathing-widget/breathing-widget.component";
import { QuotesWidgetComponent } from "../overlay-widgets/quotes-widget/quotes-widget.component";
import { TasksWidgetComponent } from "../overlay-widgets/tasks-widget/tasks-widget.component";
import { WebsitesService } from "../services/websites/websites.service";

@Component({
  selector: "app-awareness-page",
  standalone: true,
  imports: [CommonModule, QuotesWidgetComponent, BreathingWidgetComponent, TasksWidgetComponent],
  templateUrl: "./awareness-page.component.html",
  styleUrls: ["./awareness-page.component.css"],
})
export class AwarenessPageComponent {
  private route = inject(ActivatedRoute);
  private websitesService = inject(WebsitesService);

  originalTimerValue!: number;
  outputUrl: URL | null = null;
  timerValue = signal(30);
  widget = "Quotes";

  constructor() {
    getAwarenessPageWidget().then(widget => {
      this.widget = widget;
    });

    const urlParam = this.route.snapshot.paramMap.get("outputURL");
    this.outputUrl = new URL(atob(decodeURIComponent(urlParam!)));
    isDevMode() && console.log("Output url:", this.outputUrl);

    this.getTimerValue().then(timerValue => {
      this.originalTimerValue = timerValue;
      this.timerValue.set(timerValue);
      this.countdown();
    });
  }

  async getTimerValue(): Promise<number> {
    if (this.websitesService.isReady()) {
      return this.websitesService.getTimerValue(this.outputUrl!.host);
    } else {
      await this.delay(10);
      return this.getTimerValue();
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    window.location.href = this.outputUrl!.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    setTimeout(() => {
      window.close();
    }, 250);
  }
}
