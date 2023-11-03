import { Injectable } from '@angular/core';
import { blockedSite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class AllowedSitesService {
  blockedWebsites: blockedSite[] = [];
  constructor() {}

  addAllowedSite(websiteToAllow: string, duration: number = 30): void {
    if (websiteToAllow.substring(0, 3) == 'www')
      websiteToAllow = websiteToAllow.substring(4); // Removing the www.

    chrome.storage.sync.get('blockedWebsites', (result) => {
      this.blockedWebsites = result['blockedWebsites'];
      let blockedSite = this.blockedWebsites.find(
        (blockedSite) => blockedSite.host == websiteToAllow
      );
      if (!blockedSite) {
        console.log(
          '[ERROR] The website must be blocked before it can be allowed.'
        );
        return;
      }
      blockedSite.allowedUntil = new Date(
        Date.now() + duration * 60000
      ).toString();

      chrome.storage.sync.set({ blockedWebsites: this.blockedWebsites });
      console.log("Updated blocked list: ", this.blockedWebsites);
    });
  }
}