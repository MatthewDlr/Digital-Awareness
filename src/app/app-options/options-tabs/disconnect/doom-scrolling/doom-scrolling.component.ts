import { Component } from "@angular/core";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-doom-scrolling",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./doom-scrolling.component.html",
  styleUrl: "./doom-scrolling.component.css",
})
export class DoomScrollingComponent {
  doomScrollingToggle: boolean = false;

  constructor(private soundsEngine: SoundsEngineService) {
    chrome.storage.sync.get("doomScrollingToggle").then(result => {
      this.doomScrollingToggle = result["doomScrollingToggle"];
    });
  }

  toggleDoomScrolling() {
    if (this.doomScrollingToggle) {
      this.soundsEngine.switchOFF();
      this.doomScrollingToggle = false;
    } else {
      this.soundsEngine.switchON();
      this.doomScrollingToggle = true;
    }

    chrome.storage.sync.set({
      doomScrollingToggle: this.doomScrollingToggle,
    });
  }
}
