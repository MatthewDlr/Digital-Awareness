import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-disconnect",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./disconnect.component.html",
  styleUrls: ["./disconnect.component.css"],
})
export class DisconnectComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  constructor(private soundsEngine: SoundsEngineService) {
    this.loadSettings();
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
      doomScrollingNotification: this.doomScrollingToggle,
    });
  }

  async loadSettings() {
    await chrome.storage.sync.get(["doomScrollingNotification", "bindWatchingNotification"]).then(result => {
      this.doomScrollingToggle = result["doomScrollingNotification"];
      this.bindWatchingToggle = result["bindWatchingNotification"];
    });
    if (isDevMode()) {
      console.log("doomScrollingNotification: ", this.doomScrollingToggle);
      console.log("bindWatchingNotification: ", this.bindWatchingToggle);
    }
  }
}
