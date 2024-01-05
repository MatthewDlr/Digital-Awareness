import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  hasNotificationPermission: boolean = true;
  isNotificationPermissionRequested: boolean = false;

  constructor(private soundsEngine: SoundsEngineService) {
    this.loadSettings();
    chrome.notifications.getPermissionLevel(level => {
      isDevMode() ? console.log("hasNotificationPermission: ", level) : null;
      if (level != "granted") {
        this.hasNotificationPermission = false;
        this.bindWatchingToggle = false;
        this.doomScrollingToggle = false;
      }
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
      doomScrollingNotification: this.doomScrollingToggle,
    });
  }

  requestNotificationPermission() {
    chrome.permissions
      .request({
        permissions: ["notifications"],
      })
      .then(granted => {
        if (granted) {
          this.soundsEngine.success();
          this.hasNotificationPermission = true;
          this.loadSettings();
        } else {
          this.soundsEngine.error();
          this.hasNotificationPermission = false;
          this.bindWatchingToggle = false;
          this.doomScrollingToggle = false;
        }
      });
    this.isNotificationPermissionRequested = true;
  }

  async loadSettings() {
    await chrome.storage.sync.get("doomScrollingNotification").then(result => {
      this.doomScrollingToggle = result["doomScrollingNotification"];
    });

    await chrome.storage.sync.get("bindWatchingNotification").then(result => {
      this.bindWatchingToggle = result["bindWatchingNotification"];
    });
  }
}
