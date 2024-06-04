import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-about-tab",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about-tab.component.html",
  styleUrl: "./about-tab.component.css",
})
export class AboutTabComponent {
  version: string = chrome.runtime.getManifest().version;
  submit_feedback_url: string = "https://github.com/MatthewDlr/Digital-Awareness/issues";
}
