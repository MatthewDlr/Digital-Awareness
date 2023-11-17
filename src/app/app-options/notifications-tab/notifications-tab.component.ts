import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-tab',
  templateUrl: './notifications-tab.component.html',
  styleUrls: ['./notifications-tab.component.css']
})
export class NotificationsTabComponent {
  doomScrollingToggle: boolean = false;
  bindWatchingToggle: boolean = false;

  constructor() {
    chrome.storage.sync.get('doomScrollingNotification').then((result) => {
      this.doomScrollingToggle = result['doomScrollingNotification'];
    });

    chrome.storage.sync.get('bindWatchingNotification').then((result) => {
      this.bindWatchingToggle = result['bindWatchingNotification'];
    });
  }

  toggleDoomScrolling(){
    this.doomScrollingToggle = !this.doomScrollingToggle;
    chrome.storage.sync.set({ doomScrollingNotification: this.doomScrollingToggle });
  }

  toggleBindWatching(){
    this.bindWatchingToggle = !this.bindWatchingToggle;
    chrome.storage.sync.set({ bindWatchingNotification: this.bindWatchingToggle });
  }

}
