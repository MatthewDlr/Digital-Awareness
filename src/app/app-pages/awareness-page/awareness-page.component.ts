import { Component, isDevMode, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { QuotesWidgetComponent } from "../quotes-widget/quotes-widget.component";
import { AllowedSitesService } from "../services/allowed-sites/allowed-sites.service";
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
  storedTimerValue!: number;
  timerValue = signal(30);
  outputUrl!: URL;
  tabId!: string;
  widget: string = "Quotes";

  constructor(
    private route: ActivatedRoute,
    private allowedSitesService: AllowedSitesService,
  ) {
    // Getting url parameters
    this.route.params.subscribe(params => {
      this.tabId = decodeURIComponent(params["tabId"]);
      this.outputUrl = new URL(decodeURIComponent(params["outputURL"]));
    });

    // Getting timer value from the storage
    if (isDevMode()) {
      this.timerValue.set(5);
      this.countdown();
    } else {
      chrome.storage.sync.get("timerValue").then(result => {
        this.timerValue.set(result["timerValue"]);
        this.countdown();
      });
    }

    // Getting widget value from the storage
    chrome.storage.sync.get("awarenessPageWidget").then(result => {
      this.widget = result["awarenessPageWidget"];
      isDevMode() ? console.log("widget: ", this.widget) : null;
      if (this.widget == "Random") {
        this.widget = this.getRandomWidget();
      }
    });
  }

  countdown() {
    if (this.timerValue() > 0) {
      setTimeout(() => {
        async function getCurrentTab() {
          const queryOptions = { active: true, lastFocusedWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          return tab.id;
        }
        getCurrentTab().then(currentTabId => {
          if (!(currentTabId?.toString() != this.tabId || !document.hasFocus())) {
            this.timerValue.update(value => value - 1);
          }
          this.countdown();
        });
      }, 1150); // Yes, it's more than 1s
    } else {
      this.waitBeforeClose();
    }
  }

  waitBeforeClose() {
    setTimeout(() => {
      this.closeBlockPage();
    }, 15000);
  }

  // This means failure as the user has waited for the timer to expire
  skipTimer() {
    const newTimerValue = Math.min(this.storedTimerValue + 10, 180);
    chrome.storage.sync.set({ timerValue: newTimerValue });

    const minutesAllowed = isDevMode() ? 1 : 30;
    this.allowedSitesService.allowWebsiteTemporary(this.outputUrl.host, minutesAllowed);

    window.location.href = this.outputUrl.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    const newTimerValue = Math.max(this.storedTimerValue - 5, 30);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    this.allowedSitesService.incrementTimesBlocked(this.outputUrl.host);
    setTimeout(() => {
      window.close();
    }, 500);
  }

  getRandomWidget() {
    const widgets = ["Quotes", "Breathing", "Tasks"];
    const randomIndex = Math.floor(Math.random() * widgets.length);
    return widgets[randomIndex];
  }
}
