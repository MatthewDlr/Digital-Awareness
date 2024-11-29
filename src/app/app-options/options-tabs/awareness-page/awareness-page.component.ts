import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import {
  getAwarenessPageTasks,
  getAwarenessPageWidget,
  setAwarenessPageTasks,
  setAwarenessPageWidget,
} from "app/shared/chrome-storage-api";

@Component({
    selector: "app-awareness-page",
    imports: [CommonModule, FormsModule],
    templateUrl: "./awareness-page.component.html",
    styleUrls: ["./awareness-page.component.css"]
})
export class AwarenessPageComponent {
  selectedWidget = "Quotes";
  tasks!: string[];
  areTasksValid = true;

  constructor(private soundsEngine: SoundsEngineService) {
    getAwarenessPageWidget().then(widget => {
      this.selectedWidget = widget;

      if (widget == "Tasks" || widget == "Random") {
        getAwarenessPageTasks().then(tasks => {
          this.tasks = tasks;
          this.areAllTasksEmpty();
        });
      }
    });
  }

  updateSelectedWidget(widget: string) {
    this.selectedWidget = widget;
    setAwarenessPageWidget(widget);
    this.soundsEngine.select();

    if (widget == "Tasks" || widget == "Random") {
      this.areAllTasksEmpty();
    }
  }

  areAllTasksEmpty() {
    if (this.tasks[0].trim() === "" && this.tasks[1].trim() === "" && this.tasks[2].trim() === "") {
      this.areTasksValid = false;
    } else {
      this.areTasksValid = true;
    }
  }

  updateTasks() {
    if (!this.areTasksValid) return;
    setAwarenessPageTasks(this.tasks);
  }
}
