import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

@Injectable({
  providedIn: "root",
})
export class AllowedSitesService {
  enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];

  allowWebsiteTemporary(websiteToAllow: string, duration: number = 30): void {
    websiteToAllow = this.removeWWW(websiteToAllow);

    chrome.storage.local.get("enforcedWebsites", (result) => {
      this.enforcedWebsites = result["enforcedWebsites"];
      const enforcedWebsite = this.enforcedWebsites.find(
        (enforcedSite) => enforcedSite.host == websiteToAllow,
      );
      if (enforcedWebsite) {
        this.updateWebsiteAllowedDate(enforcedWebsite, duration);
        chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
        isDevMode()
          ? console.log(
            "Updated enforcedWebsites list: ",
            this.enforcedWebsites,
          )
          : null;
      } else {
        chrome.storage.sync.get("userWebsites", (result) => {
          this.userWebsites = result["userWebsites"];
          const userWebsite = this.userWebsites.find(
            (userWebsite) => userWebsite.host == websiteToAllow,
          );
          if (userWebsite) {
            this.updateWebsiteAllowedDate(userWebsite, duration);

            chrome.storage.sync.set({ userWebsites: this.userWebsites });
            isDevMode()
              ? console.log("Updated userWebsites list: ", this.userWebsites)
              : null;
          }
        });
      }
    });
  }

  incrementTimesBlocked(websiteToIncrement: string) {
    websiteToIncrement = this.removeWWW(websiteToIncrement);

    chrome.storage.local.get("enforcedWebsites", (result) => {
      this.enforcedWebsites = result["enforcedWebsites"];
      const enforcedWebsite = this.enforcedWebsites.find(
        (enforcedSite) => enforcedSite.host == websiteToIncrement,
      );
      if (enforcedWebsite) {
        enforcedWebsite.timesBlocked++;
        chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites });
        isDevMode()
          ? console.log(
            "Updated enforcedWebsites list: ",
            this.enforcedWebsites,
          )
          : null;
      } else {
        chrome.storage.sync.get("userWebsites", (result) => {
          this.userWebsites = result["userWebsites"];
          const userWebsite = this.userWebsites.find(
            (userWebsite) => userWebsite.host == websiteToIncrement,
          );
          if (userWebsite) {
            userWebsite.timesBlocked++;
            chrome.storage.sync.set({ userWebsites: this.userWebsites });
            isDevMode()
              ? console.log("Updated userWebsites list: ", this.userWebsites)
              : null;
          }
        });
      }
    });
  }

  removeWWW(website: string): string {
    if (website.substring(0, 3) == "www") return website.substring(4);
    return website;
  }

  updateWebsiteAllowedDate(website: watchedWebsite, duration: number) {
    website.allowedUntil = new Date(Date.now() + duration * 60000).toString();
    website.timesAllowed++;
  }
}
