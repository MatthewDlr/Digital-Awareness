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
  timerBehavior!: string;

  constructor(
    private route: ActivatedRoute,
    private allowedSitesService: AllowedSitesService,
  ) {
    // Getting url parameters
    this.route.params.subscribe(params => {
      this.tabId = decodeURIComponent(params["tabId"]);
      this.outputUrl = new URL(decodeURIComponent(params["outputURL"]));
    });
    
    chrome.storage.sync.get("awarenessPageWidget").then(result => {
      this.widget = result["awarenessPageWidget"];
      isDevMode() ? console.log("widget: ", this.widget) : null;
      if (this.widget == "Random") {
        this.widget = this.getRandomWidget();
      }
    });
    
    chrome.storage.sync.get(["timerBehavior"]).then(result => {
      this.timerBehavior = result["timerBehavior"] || "None";
      isDevMode() ? console.log("Timer behavior loaded: ", this.timerBehavior) : null;
    });

    // Sometimes the initialization of the allowedSitesService is not finished when the component is created
    // So we wait for it to be finished before getting the timer value
    let numberOfTry = 10;
    const intervalId = setInterval(() => {
      if (this.allowedSitesService.initializationStep == 2) {
        clearInterval(intervalId);
        this.storedTimerValue = this.allowedSitesService.getTimerValue(this.outputUrl.host);
        this.timerValue.set(this.storedTimerValue);
        this.countdown();
      } else {
        numberOfTry--;
        if (numberOfTry == 0) {
          clearInterval(intervalId);
          throw new Error("Could not load the timer value");
        }
      }
    }, 50);

  }

  countdown() {
    if (this.timerValue() > 0) {
      setTimeout(() => {
        this.getCurrentTab().then(currentTabId => {
          // if the user is not on the tab, don't decrement the timer
          if (!(currentTabId?.toString() != this.tabId || !document.hasFocus())) {
            this.timerValue.update(value => value - 1);
          } else {
            // If the user is not on the tab, and the timer behavior is "Restart", restart the timer
            if (this.timerBehavior == "Restart") {
              this.timerValue.set(this.storedTimerValue);
            }
          }
          this.countdown();
        });
      }, 1150); // Yes, it's more than 1s
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
    setTimeout(() => {
      this.closeBlockPage();
    }, 15000);
  }

  // This means failure as the user has waited for the timer to expire
  skipTimer() {
    const newTimerValue = Math.min(this.storedTimerValue + 15, 180);
    const minutesAllowed = isDevMode() ? 1 : 30;
    this.allowedSitesService.allowWebsiteTemporary(this.outputUrl.host, minutesAllowed, newTimerValue);

    window.location.href = this.outputUrl.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    const newTimerValue = Math.max(this.storedTimerValue - 5, 30);

    this.allowedSitesService.incrementTimesBlocked(this.outputUrl.host, newTimerValue);
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