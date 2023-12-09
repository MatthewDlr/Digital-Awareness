import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

@Injectable({
  providedIn: "root",
})
export class AllowedSitesService {
  enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];
  websiteOrigin: string = "Enforced";
  initializationStep: number = 0;

  constructor() {
    chrome.storage.local
      .get("enforcedWebsites")
      .then(result => {
        this.enforcedWebsites = result["enforcedWebsites"];
        this.initializationStep++;
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });

    chrome.storage.sync
      .get("userWebsites")
      .then(result => {
        this.initializationStep++;
        this.userWebsites = result["userWebsites"];
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });
  }

  getTimerValue(website: string): number {
    website = this.removeWWW(website);

    const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == website);
    if (enforcedWebsite) {
      this.websiteOrigin = "Enforced";
      return isDevMode() ? 5 : enforcedWebsite.timer;
    } else {
      const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == website);
      if (userWebsite) {
        this.websiteOrigin = "User";
        return isDevMode() ? 5 : userWebsite.timer;
      }
    }
    isDevMode() ? console.error("Website not found in enforcedWebsites or userWebsites: ", website) : null;
    return 30;
  }

  allowWebsiteTemporary(websiteToAllow: string, duration: number = 30, newTimerValue: number): void {
    websiteToAllow = this.removeWWW(websiteToAllow);

    if (this.websiteOrigin == "Enforced") {
      const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == websiteToAllow);
      this.updateWebsiteAllowedDate(enforcedWebsite!, duration);
      enforcedWebsite!.timer = newTimerValue;
      chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
    } else if (this.websiteOrigin == "User") {
      const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == websiteToAllow);
      this.updateWebsiteAllowedDate(userWebsite!, duration);
      userWebsite!.timer = newTimerValue;
      chrome.storage.sync.set({ userWebsites: this.userWebsites });
    } else {
      isDevMode() ? console.error("cannot allow this website: ", websiteToAllow) : null;
    }
  }

  incrementTimesBlocked(websiteToIncrement: string, newTimerValue: number) {
    websiteToIncrement = this.removeWWW(websiteToIncrement);

    if (this.websiteOrigin == "Enforced") {
      const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == websiteToIncrement);
      enforcedWebsite!.timesBlocked++;
      enforcedWebsite!.timer = newTimerValue;
      chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
    } else if (this.websiteOrigin == "User") {
      const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == websiteToIncrement);
      userWebsite!.timesBlocked++;
      userWebsite!.timer = newTimerValue;
      chrome.storage.sync.set({ userWebsites: this.userWebsites });
    }
  }

  private removeWWW(website: string): string {
    if (website.substring(0, 3) == "www") return website.substring(4);
    return website;
  }

  private updateWebsiteAllowedDate(website: watchedWebsite, duration: number) {
    website.allowedUntil = new Date(Date.now() + duration * 60000).toString();
    website.timesAllowed++;
  }
}
