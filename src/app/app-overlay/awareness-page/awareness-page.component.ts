import { Component, isDevMode, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { QuotesWidgetComponent } from "../quotes-widget/quotes-widget.component";
import { WebsitesService } from "../services/websites/websites.service";
import { BreathingWidgetComponent } from "../breathing-widget/breathing-widget.component";
import { TasksWidgetComponent } from "../tasks-widget/tasks-widget.component";

@Component({
  selector: "app-awareness-page",
  standalone: true,
  imports: [CommonModule, QuotesWidgetComponent, BreathingWidgetComponent, TasksWidgetComponent],
  templateUrl: "./awareness-page.component.html",
  styleUrls: ["./awareness-page.component.css"],
})
export class AwarenessPageComponent {
  originalTimerValue!: number;
  timerValue = signal(30);
  outputUrl!: URL;
  widget: string = "Quotes";
  timerBehavior!: string;
  isWindowFocused: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private websitesService: WebsitesService,
  ) {
    // Getting url parameters
    this.route.params.subscribe(params => {
      this.outputUrl = new URL(atob(decodeURIComponent(params["outputURL"])));
    });

    chrome.storage.sync.get("awarenessPageWidget").then(result => {
      this.widget = result["awarenessPageWidget"] || "Quotes";
      isDevMode() ? console.log("widget: ", this.widget) : null;
      if (this.widget == "Random") this.widget = this.getRandomWidget();
    });

    chrome.storage.sync.get(["timerBehavior"]).then(result => {
      this.timerBehavior = result["timerBehavior"] || "None";
      isDevMode() ? console.log("Timer behavior loaded: ", this.timerBehavior) : null;
    });

    document.addEventListener("visibilitychange", () => {
      document.hidden ? (this.isWindowFocused = false) : (this.isWindowFocused = true);
    });

    websitesService.areWebsitesLoaded.subscribe(() => {
      this.originalTimerValue = websitesService.getTimerValue(this.outputUrl.host);
      this.timerValue.set(this.originalTimerValue);
      this.countdown();
    });
  }

  countdown() {
    if (this.timerValue() > 0) {
      setTimeout(() => {
        if ((document.hasFocus() && this.isWindowFocused) || isDevMode()) {
          this.timerValue.update(value => value - 1);
        } else {
          this.timerValue.set(this.originalTimerValue); // If the user is not on the tab, we restart the timer
        }
        this.countdown();
      }, 1100); // Yes, it's more than 1s
    } else {
      this.waitBeforeClose();
    }
  }

  async getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  }

  waitBeforeClose() {
    if (isDevMode()) return;

    setTimeout(() => {
      window.close();
    }, 10000);
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

  private getRandomWidget() {
    const widgets = ["Quotes", "Breathing", "Tasks"];
    const randomIndex = Math.floor(Math.random() * widgets.length);
    return widgets[randomIndex];
  }
}
