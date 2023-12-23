import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

const DEFAULT_ALLOWED_DURATION = 30; // In minutes

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  enforcedWebsites!: watchedWebsite[];
  userWebsites!: watchedWebsite[];
  websiteOrigin: string = "Enforced";
  currentWebsite!: watchedWebsite;

  constructor() {
    chrome.storage.local
      .get("enforcedWebsites")
      .then(result => {
        this.enforcedWebsites = result["enforcedWebsites"] || [];
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });

    chrome.storage.sync
      .get("userWebsites")
      .then(result => {
        this.userWebsites = result["userWebsites"] || [];
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });
  }

  isInitialized(): boolean {
    return this.enforcedWebsites && this.userWebsites ? true : false;
  }

  getTimerValue(website: string): number {
    this.currentWebsite = this.getCurrentWebsite(website);
    if (isDevMode()) return 5;

    const timerValue = this.currentWebsite.timer || 30;
    const accuracy = Math.max(this.currentWebsite.timesBlocked + this.currentWebsite.timesAllowed, 1);
    const websiteScore = ((this.currentWebsite.timesBlocked - this.currentWebsite.timesAllowed) / accuracy) * 100; // This return a score between -100 and 100 where 100 means the user never allowed the website and -100 means the user never blocked the website

    if (accuracy < 5) {
      isDevMode() ? console.log("Not enough data to adjust the timer value") : null;
      return timerValue; // If the user has not interacted with the website enough, we don't change the timer value
    }

    if (websiteScore < -75) {
      return timerValue * 2;
    }

    if (websiteScore < -50) {
      return timerValue * 1.5;
    }

    if (websiteScore > 75) {
      return timerValue / 1.2; // If the user user a good score, we reduce slightly the timer value
    }

    return timerValue;
  }

  allowWebsiteTemporary() {
    const timeAllowed = isDevMode() ? 1 : DEFAULT_ALLOWED_DURATION;
    console.log(this.currentWebsite);

    const website =
      this.websiteOrigin === "Enforced"
        ? this.enforcedWebsites.find(site => site.host === this.currentWebsite.host)
        : this.userWebsites.find(site => site.host === this.currentWebsite.host);
    if (!website) {
      isDevMode() ? console.error("cannot allow this website: ", this.currentWebsite) : null;
      return;
    }

    this.updateWebsiteAllowedDate(website!, timeAllowed);
    website!.timer = this.computeNewTimerValue();
    this.websiteOrigin === "Enforced"
      ? chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
  }

  incrementTimesBlocked() {
    if (this.websiteOrigin !== "Enforced" && this.websiteOrigin !== "User") {
      isDevMode() ? console.error("invalid website origin: ", this.websiteOrigin) : null;
      return;
    }

    const website =
      this.websiteOrigin === "Enforced"
        ? this.enforcedWebsites.find(site => site.host === this.currentWebsite.host)
        : this.userWebsites.find(site => site.host === this.currentWebsite.host);
    if (!website) {
      isDevMode() ? console.error("cannot increment times blocked for non-existent website") : null;
      return;
    }
  }

  private computeNewTimerValue(): number {
    const currentValue = this.currentWebsite.timer || 30;
    const newValue = currentValue + Math.round(10 * Math.log10(5000 / currentValue));
    isDevMode() ? console.log("New timer value: ", newValue) : null;
    return newValue;
  }

  private getCurrentWebsite(website: string): watchedWebsite {
    website = this.removeWWW(website);

    const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == website);
    if (enforcedWebsite) {
      this.websiteOrigin = "Enforced";
      return enforcedWebsite;
    } else {
      const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == website);
      if (userWebsite) {
        this.websiteOrigin = "User";
        return userWebsite;
      }
    }
    throw new Error("Website not found in chrome storage: " + website);
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
