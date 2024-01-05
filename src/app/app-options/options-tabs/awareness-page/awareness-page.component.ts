import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-awareness-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./awareness-page.component.html",
  styleUrls: ["./awareness-page.component.css"],
})
export class AwarenessPageComponent {
  selectedWidget: string = "Quotes";
  tasks!: string[];
  areTasksValid: boolean = true;
  timerBehavior!: string;

  constructor(private soundsEngine: SoundsEngineService) {
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
    this.soundsEngine.select();

    if (widget == "Tasks" || widget == "Random") {
      this.checkIfTasksValid();
    }
  }

  updateTimerBehavior(timerBehavior: string) {
    this.timerBehavior = timerBehavior;
    chrome.storage.sync.set({ timerBehavior: timerBehavior });
    this.soundsEngine.select();
    isDevMode() ? console.log("Timer behavior saved: ", this.timerBehavior) : null;
  }

  checkIfTasksValid() {
    if (this.tasks[0] == "" && this.tasks[1] == "" && this.tasks[2] == "") {
      this.areTasksValid = false;
      this.soundsEngine.error();
    } else {
      this.areTasksValid = true;
    }
  }

  updateTasks() {
    if (!this.areTasksValid) return;

    chrome.storage.sync
      .set({ awarenessPageTasks: this.tasks })
      .then(() => {
        isDevMode() ? console.log("Tasks saved: ", this.tasks) : null;
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
        this.areTasksValid = false;
        this.soundsEngine.error();
      });
  }
}
