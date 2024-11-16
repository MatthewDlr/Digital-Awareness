import { Component } from "@angular/core";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { CommonModule } from "@angular/common";
import { getDoomScrollingToggle, setDoomScrollingToggle } from "app/shared/chrome-storage-api";

@Component({
  selector: "app-doom-scrolling",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./doom-scrolling.component.html",
  styleUrl: "./doom-scrolling.component.css",
})
export class DoomScrollingComponent {
  doomScrollingToggle = false;

  constructor(private soundsEngine: SoundsEngineService) {
    getDoomScrollingToggle().then(doomScrollingToggle => {
      this.doomScrollingToggle = doomScrollingToggle;
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

    setDoomScrollingToggle(this.doomScrollingToggle);
  }
}
