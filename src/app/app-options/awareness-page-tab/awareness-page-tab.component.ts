import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-awareness-page-tab",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./awareness-page-tab.component.html",
  styleUrls: ["./awareness-page-tab.component.css"],
})
export class AwarenessPageTabComponent {
  selectedWidget: string = "Quotes";
  tasks!: string[];
  areTasksValid: boolean = true;
  timerBehavior!: string ;

  constructor() {
    chrome.storage.sync.get(["awarenessPageWidget"]).then(result => {
      this.selectedWidget = result["awarenessPageWidget"];
    });

    chrome.storage.sync.get(["awarenessPageTasks"]).then(result => {
      this.tasks = result["awarenessPageTasks"] || ["", "", ""];
      isDevMode() ? console.log("Tasks loaded: ", this.tasks) : null;
    });

    chrome.storage.sync.get(["timerBehavior"]).then(result => {
      this.timerBehavior = result["timerBehavior"] || "None";
      isDevMode() ? console.log("Timer behavior loaded: ", this.timerBehavior) : null;
    });
  }

  updateSelectedWidget(widget: string) {
    this.selectedWidget = widget;
    chrome.storage.sync.set({ awarenessPageWidget: widget });
  }

  updateTimerBehavior(timerBehavior: string) {
    this.timerBehavior = timerBehavior;
    chrome.storage.sync.set({ timerBehavior: timerBehavior });
    isDevMode() ? console.log("Timer behavior saved: ", this.timerBehavior) : null;
  }

  checkIfTasksValid() {
    if (this.tasks[0] == "" && this.tasks[1] == "" && this.tasks[2] == "") {
      this.areTasksValid = false;
    } else {
      this.areTasksValid = true;
    }
  }

  updateTasks() {
    if (!this.areTasksValid) return;

    chrome.storage.sync.set({ awarenessPageTasks: this.tasks }).then(() => {
      isDevMode() ? console.log("Tasks saved: ", this.tasks) : null;
    });
  }
}
