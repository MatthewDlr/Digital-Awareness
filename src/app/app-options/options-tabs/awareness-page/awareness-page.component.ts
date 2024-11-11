import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-awareness-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./awareness-page.component.html",
  styleUrls: ["./awareness-page.component.css"],
})
export class AwarenessPageComponent {
  selectedWidget = "Quotes";
  tasks!: string[];
  areTasksValid = true;

  constructor(private soundsEngine: SoundsEngineService) {
    chrome.storage.sync.get(["awarenessPageWidget"]).then(result => {
      this.selectedWidget = result["awarenessPageWidget"];
    });

    chrome.storage.sync.get(["awarenessPageTasks"]).then(result => {
      this.tasks = result["awarenessPageTasks"] || ["", "", ""];
      isDevMode() ? console.log("Tasks loaded: ", this.tasks) : null;
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

  checkIfTasksValid() {
    if (this.tasks[0].trim() == "" && this.tasks[1].trim() == "" && this.tasks[2].trim() == "") {
      if (this.areTasksValid) this.soundsEngine.error();
      this.areTasksValid = false;
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
