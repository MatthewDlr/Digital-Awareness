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
  bingeWatchingToggle: boolean = false;
  bingeWatchingSupportedWebsites: string[] = [];

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

  toggleBingeWatching() {
    if (this.bingeWatchingToggle) {
      this.soundsEngine.switchOFF();
      this.bingeWatchingToggle = false;
    } else {
      this.soundsEngine.switchON();
      this.bingeWatchingToggle = true;
    }

    chrome.storage.sync.set({
      bingeWatchingToggle: this.bingeWatchingToggle,
    });
  }

  async loadSettings() {
    await chrome.storage.sync.get(["doomScrollingToggle", "bingeWatchingToggle"]).then(result => {
      this.doomScrollingToggle = result["doomScrollingToggle"];
      this.bingeWatchingToggle = result["bingeWatchingToggle"];
    });
    await chrome.storage.local.get("bingeWatchingSupportedWebsites").then(result => {
      this.bingeWatchingSupportedWebsites = result["bingeWatchingSupportedWebsites"] || [];
    });

    if (isDevMode()) {
      console.log("doomScrollingToggle: ", this.doomScrollingToggle);
      console.log("bingeWatchingToggle: ", this.bingeWatchingToggle);
      console.log("bingeWatchingSupportedWebsites: ", this.bingeWatchingSupportedWebsites);
    }
  }
}
