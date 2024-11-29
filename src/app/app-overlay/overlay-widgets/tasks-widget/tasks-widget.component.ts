import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { getAwarenessPageTasks } from "app/shared/chrome-storage-api";

@Component({
    selector: "app-tasks-widget",
    imports: [CommonModule],
    templateUrl: "./tasks-widget.component.html",
    styleUrl: "./tasks-widget.component.css"
})
export class TasksWidgetComponent {
  tasks!: string[];
  randomTask!: string;

  constructor() {
    getAwarenessPageTasks().then(tasks => {
      this.tasks = tasks;
    });
  }
}
