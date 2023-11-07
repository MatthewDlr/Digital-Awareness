import { Injectable } from '@angular/core';
import { watchedWebsite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class AllowedSitesService {
  blockedWebsites: watchedWebsite[] = [];
  constructor() {}

  allowWebsiteTemporary(websiteToAllow: string, duration: number = 30): void {
    if (websiteToAllow.substring(0, 3) == 'www')
      websiteToAllow = websiteToAllow.substring(4); // Removing the www.

    chrome.storage.sync.get('blockedWebsites', (result) => {
      this.blockedWebsites = result['blockedWebsites'];
      let blockedSite = this.blockedWebsites.find(
        (blockedSite) => blockedSite.url == websiteToAllow,
      );
      if (!blockedSite) {
        console.log(
          '[ERROR] The website must be blocked before it can be allowed.',
        );
        return;
      }
      blockedSite.allowedUntil = new Date(
        Date.now() + duration * 60000,
      ).toString();

      blockedSite.timesAllowed++;

      chrome.storage.sync.set({ blockedWebsites: this.blockedWebsites });
      console.log('Updated blocked list: ', this.blockedWebsites);
    });
  }

  incrementTimesBlocked(website: string) {
    if (website.substring(0, 3) == 'www') website = website.substring(4); // Removing the www.

    chrome.storage.sync.get('blockedWebsites', (result) => {
      this.blockedWebsites = result['blockedWebsites'];
      let blockedSite = this.blockedWebsites.find(
        (blockedSite) => blockedSite.url == website,
      );
      if (!blockedSite) {
        console.log('[ERROR] The website should be blocked and it is not');
        return;
      }
      blockedSite.timesBlocked++;

      chrome.storage.sync.set({ blockedWebsites: this.blockedWebsites });
      console.log('Incremented Times Blocked: ', blockedSite);
    });
  }
}
