import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.css",
})
export class AboutComponent {
  version: string = chrome.runtime.getManifest().version;
  submit_feedback_url: string = "https://github.com/MatthewDlr/Digital-Awareness/issues";
}
