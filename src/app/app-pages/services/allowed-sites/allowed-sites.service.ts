import { Injectable } from '@angular/core';
import { watchedWebsite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class AllowedSitesService {
  enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];

  allowWebsiteTemporary(websiteToAllow: string, duration: number = 30): void {
    websiteToAllow = this.removeWWW(websiteToAllow);

    chrome.storage.local.get('enforcedWebsites', (result) => {
      this.enforcedWebsites = result['enforcedWebsites'];
      let enforcedWebsite = this.enforcedWebsites.find(
        (enforcedSite) => enforcedSite.host == websiteToAllow,
      );
      if (enforcedWebsite) {
        this.updateWebsiteAllowedDate(enforcedWebsite, duration);
        chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
        console.log('Updated enforcedWebsites list: ', this.enforcedWebsites);
      } else {
        chrome.storage.sync.get('userWebsites', (result) => {
          this.userWebsites = result['userWebsites'];
          let userWebsite = this.userWebsites.find(
            (userWebsite) => userWebsite.host == websiteToAllow,
          );
          if (userWebsite) {
            this.updateWebsiteAllowedDate(userWebsite, duration);

            chrome.storage.sync.set({ userWebsites: this.userWebsites });
            console.log('Updated userWebsites list: ', this.userWebsites);
          }
        });
      }
    });
  }

  incrementTimesBlocked(websiteToIncrement: string) {
    websiteToIncrement = this.removeWWW(websiteToIncrement);

    chrome.storage.local.get('enforcedWebsites', (result) => {
      this.enforcedWebsites = result['enforcedWebsites'];
      let enforcedWebsite = this.enforcedWebsites.find(
        (enforcedSite) => enforcedSite.host == websiteToIncrement,
      );
      if (enforcedWebsite) {
        enforcedWebsite.timesBlocked++;
        chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
        console.log('Updated enforcedWebsites list: ', this.enforcedWebsites);
      } else {
        chrome.storage.sync.get('userWebsites', (result) => {
          this.userWebsites = result['userWebsites'];
          let userWebsite = this.userWebsites.find(
            (userWebsite) => userWebsite.host == websiteToIncrement,
          );
          if (userWebsite) {
            userWebsite.timesBlocked++;
            chrome.storage.sync.set({ userWebsites: this.userWebsites });
            console.log('Updated userWebsites list: ', this.userWebsites);
          }
        });
      }
    });
  }

  removeWWW(website: string): string {
    if (website.substring(0, 3) == 'www') return website.substring(4);
    return website;
  }

  updateWebsiteAllowedDate(website: watchedWebsite, duration: number) {
    website.allowedUntil = new Date(Date.now() + duration * 60000).toString();
    website.timesAllowed++;
  }
}
