import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-disconnect",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./disconnect.component.html",
  styleUrls: ["./disconnect.component.css"],
})
export class DisconnectComponent {
  doomScrollingToggle: boolean = false;

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
      doomScrollingToggle: this.doomScrollingToggle,
    });
  }

  async loadSettings() {
    await chrome.storage.sync.get(["doomScrollingToggle", "bingeWatchingToggle"]).then(result => {
      this.doomScrollingToggle = result["doomScrollingToggle"];
    });

    isDevMode() && console.log("doomScrollingToggle: ", this.doomScrollingToggle);
  }
}
