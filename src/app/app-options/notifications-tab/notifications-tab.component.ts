import { Component } from '@angular/core';
import { PendingChangesService } from '../services/pending-changes/pending-changes.service';

@Component({
  selector: 'app-notifications-tab',
  templateUrl: './notifications-tab.component.html',
  styleUrls: ['./notifications-tab.component.css'],
})
export class NotificationsTabComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  constructor(private pendingChangesService: PendingChangesService) {
    chrome.storage.sync.get('doomScrollingNotification').then((result) => {
      this.doomScrollingToggle = result['doomScrollingNotification'];
    });

    chrome.storage.sync.get('bindWatchingNotification').then((result) => {
      this.bindWatchingToggle = result['bindWatchingNotification'];
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
}
