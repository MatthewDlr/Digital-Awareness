import { Component } from '@angular/core';
import { blockedSite } from 'src/app/types';

@Component({
  selector: 'app-blocklist-tab',
  templateUrl: './blocklist-tab.component.html',
  styleUrls: ['./blocklist-tab.component.css'],
})
export class BlocklistTabComponent {
  isLoading: boolean = true;
  blockedWebsites: blockedSite[] = [];

  constructor() {
    chrome.storage.sync.get('blockedWebsites').then((result) => {
      this.blockedWebsites = result['blockedWebsites'];
      this.isLoading = false;
    });
  }

  computeBlockedScore(website: blockedSite): string {
    console.log(website);
    let score =
      (website.timesBlocked * 100) /
      (website.timesBlocked + website.timesAllowed);
    if (score) {
      score = Math.round(score)
      return score + '%';
    }
    return '-';
  }
}
