import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks-widget.component.html',
  styleUrl: './tasks-widget.component.css'
})
export class TasksWidgetComponent {
  tasks!: string[];
  randomTask!: string;

  constructor() {
    chrome.storage.sync.get(['awarenessPageTasks']).then((result) => {
      this.tasks = result['awarenessPageTasks'] || ['', '', ''];

      const nonEmptyTasks = this.tasks.filter((task) => task.length > 0);
      if (nonEmptyTasks.length === 0) {
        this.randomTask = 'Why not start to reflect on what goal you want to accomplish?';
        return;
      }
  
      const randomIndex = Math.floor(Math.random() * nonEmptyTasks.length);
      this.randomTask = nonEmptyTasks[randomIndex];

    }).catch((error) => {
      console.error(error);
      this.randomTask = 'Why not start to reflect on what goal you want to accomplish?';
    });
  }


}
