import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-notifications-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-option.component.html',
  styleUrls: ['./notifications-option.component.css'],
})
export class NotificationsOptionComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  hasNotificationPermission: boolean = true;
  isNotificationPermissionRequested: boolean = false;

  constructor() {
    this.loadSettings();
    chrome.notifications.getPermissionLevel(level => {
      isDevMode() ? console.log("hasNotificationPermission: ", level) : null;
      if (level != "granted") {
        this.hasNotificationPermission = false;
        this.bindWatchingToggle = false;
        this.doomScrollingToggle = false;
      }
    });

    chrome.storage.local.set({ isDevMode: isDevMode() });
  }

  toggleDoomScrolling() {
    this.doomScrollingToggle = !this.doomScrollingToggle;
    chrome.storage.sync.set({
      doomScrollingNotification: this.doomScrollingToggle,
    });
  }

  toggleBindWatching() {
    this.bindWatchingToggle = !this.bindWatchingToggle;
    chrome.storage.sync.set({
      bindWatchingNotification: this.bindWatchingToggle,
    });
  }

  requestNotificationPermission() {
    chrome.permissions
      .request({
        permissions: ["notifications"],
      })
      .then(granted => {
        if (granted) {
          this.hasNotificationPermission = true;
          this.loadSettings();
        } else {
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
