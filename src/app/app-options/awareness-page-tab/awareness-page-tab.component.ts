import { Component, isDevMode } from "@angular/core";

@Component({
  selector: "app-awareness-page-tab",
  templateUrl: "./awareness-page-tab.component.html",
  styleUrls: ["./awareness-page-tab.component.css"],
})
export class AwarenessPageTabComponent {
  selectedWidget: string = "Quotes";
  tasks!: string[];
  areTasksValid: boolean = true;

  constructor() {
    chrome.storage.sync.get(["awarenessPageWidget"]).then((result) => {
      this.selectedWidget = result["awarenessPageWidget"];
    });

    chrome.storage.sync.get(["awarenessPageTasks"]).then((result) => {
      this.tasks = result["awarenessPageTasks"] || ["", "", ""];
      isDevMode() ? console.log("Tasks loaded: ", this.tasks): null;
    });
  }

  updateSelectedWidget(widget: string) {
    this.selectedWidget = widget;
    chrome.storage.sync.set({ awarenessPageWidget: widget });
  }

  updateTasks() {
    if (this.tasks[0] == "" && this.tasks[1] == "" && this.tasks[2] == "") {
      this.areTasksValid = false;
      return;
    }
    
    this.areTasksValid = true;
    chrome.storage.sync.set({ awarenessPageTasks: this.tasks }).then(() => {
      isDevMode() ? console.log("Tasks saved: ", this.tasks): null;
    });
  }
}
