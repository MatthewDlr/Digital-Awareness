import { Component, isDevMode } from "@angular/core";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";

@Component({
  selector: "app-notifications-tab",
  templateUrl: "./notifications-tab.component.html",
  styleUrls: ["./notifications-tab.component.css"],
})
export class NotificationsTabComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  hasNotificationPermission: boolean = false;
  isNotificationPermissionRequested: boolean = false;

  constructor(private pendingChangesService: PendingChangesService) {
    this.getLocalData();
    chrome.notifications.getPermissionLevel((level) => {
      if (level === "granted") {
        this.hasNotificationPermission = true;
        isDevMode()
          ? console.log(
            "hasNotificationPermission: ",
            this.hasNotificationPermission,
          )
          : null;
      }
    });

    chrome.storage.local.set({ isDevMode: isDevMode() });

    this.pendingChangesService.areChangesPending.subscribe({
      next: () => {
        this.getLocalData();
      },
    });
  }

  toggleDoomScrolling() {
    if (!this.doomScrollingToggle) {
      this.doomScrollingToggle = true;
      this.pendingChangesService.enableDoomScrolling();
      chrome.storage.sync.set({ doomScrollingNotification: true });
    } else {
      this.doomScrollingToggle = false;
      this.pendingChangesService.disableDoomScrolling();
    }
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
      .then((granted) => {
        if (granted) {
          this.hasNotificationPermission = true;
        } else {
          this.hasNotificationPermission = false;
        }
      });
    this.isNotificationPermissionRequested = true;
  }

  getLocalData() {
    chrome.storage.sync.get("doomScrollingNotification").then((result) => {
      this.doomScrollingToggle = result["doomScrollingNotification"];
    });

    chrome.storage.sync.get("bindWatchingNotification").then((result) => {
      this.bindWatchingToggle = result["bindWatchingNotification"];
    });
  }
}
