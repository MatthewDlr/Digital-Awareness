import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

const DEFAULT_ALLOWED_DURATION = 30; // In minutes. When the user allow the website (aka failure), this define how long the website will get whitelisted and accessible without need to wait the timer to dwindle
const DEFAULT_INTERVAL_DURATION = 15; // In minutes. When the user click on "Go back" (aka success), this define how long the extension will wait before taking in consideration a new entry for this button (like a cooldown)
const MAX_TIMER_VALUE = 3; // In minutes. Refers to the maximum time the timer can reach, despite user behavior

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  enforcedWebsites!: watchedWebsite[];
  userWebsites!: watchedWebsite[];
  websiteOrigin: string = "Enforced"; // Refers to whether the website is blocked by default by the extension (enforced) or by the user (User)
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
    const score = this.computeWebsiteScore(this.currentWebsite);

    // If the user has not interacted with the website enough, we don't change the timer value
    if (score == -1) {
      return timerValue;
    }

    // If the user user a bad score, we increase the timer value to nudge him and make him go back
    if (score < 10) {
      return timerValue * 1.75;
    }
    if (score < 20) {
      return timerValue * 1.5;
    }

    // If the user user a good score, we reduce slightly the timer value to tell him it's okay to access the website
    if (score > 90) {
      return timerValue / 1.25;
    }
    if (score > 80) {
      return timerValue / 1.1;
    }

    return timerValue;
  }

  // This is called when the user decide to visit the website, it counts as a 'failure'
  allowWebsiteTemporary(): void {
    const websiteAllowed =
      this.websiteOrigin == "Enforced"
        ? this.enforcedWebsites.find(enforcedSite => enforcedSite.host == this.currentWebsite.host)
        : this.userWebsites.find(userWebsite => userWebsite.host == this.currentWebsite.host);

    if (!websiteAllowed) {
      isDevMode() ? console.error("Failed to retrieve the website from chrome storage: ", this.currentWebsite) : null;
      return;
    }

    this.updateWebsiteAllowedDate(websiteAllowed);
    websiteAllowed.timer = this.computeNewIncreasedValue();

    this.websiteOrigin == "Enforced"
      ? chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
  }

  // This is called when the user decide to click on "Go back", it counts as a 'success'
  incrementTimesBlocked() {
    const websiteBlocked =
      this.websiteOrigin == "Enforced"
        ? this.enforcedWebsites.find(enforcedSite => enforcedSite.host == this.currentWebsite.host)
        : this.userWebsites.find(userWebsite => userWebsite.host == this.currentWebsite.host);

    if (!websiteBlocked) {
      isDevMode() ? console.error("Failed to retrieve the website from chrome storage: ", this.currentWebsite) : null;
      return;
    }

    const delay = isDevMode() ? 30000 : DEFAULT_INTERVAL_DURATION * 60000;
    if (new Date(websiteBlocked.blockedAt).getTime() + delay > Date.now()) {
      isDevMode()
        ? console.log(
            "Website was blocked less than " + DEFAULT_INTERVAL_DURATION + " minutes ago, not incrementing the counter",
          )
        : null;
      return;
    }

    websiteBlocked.blockedAt = new Date().toString();
    websiteBlocked.timesBlocked++;
    websiteBlocked.timer = this.computeNewDecreasedValue();

    this.websiteOrigin == "Enforced"
      ? chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
  }

  // Return a score between 0 and 100 that aims to score the current habit of the user for this website
  // If there is not enough data to provide a reliable score, it returns -1
  computeWebsiteScore(website: watchedWebsite): number {
    const accuracy = website.timesBlocked + website.timesAllowed;
    if (accuracy < 5) {
      isDevMode() ? console.log("Not enough data to provide a reliable score for " + website.host) : null;
      return -1;
    }

    const websiteScore = ((website.timesBlocked - website.timesAllowed) / accuracy) * 40 + 50; // 90% of the score depends on the ratio between times blocked and times allowed
    const daysSinceLastAllowed = this.clamp(
      (Date.now() - new Date(website.allowedUntil).getTime()) / (1000 * 60 * 60 * 24),
      1,
      7,
    ); // Return the number of days since the last time the website was allowed with min 1 and max 7
    const lastAllowedScore = (daysSinceLastAllowed / 7) * 10;

    const score = Math.round(websiteScore + lastAllowedScore);
    isDevMode() ? console.log("Website Score for " + website.host + " is " + score) : null;
    return score;
  }

  // Algorithm to compute the new timer value when the user allow a website (failure)
  private computeNewIncreasedValue(): number {
    const currentValue = this.currentWebsite.timer || 30;
    const score = this.computeWebsiteScore(this.currentWebsite);
    let newValue = currentValue;

    // The lower the score, the more aggrevise the increase function is
    if (score == -1 || (score >= 30 && score <= 70)) {
      newValue += (newValue / 8) ^ 1.5; // Default increase function.
    } else if (score < 30) {
      newValue += (newValue / 8) ^ 2;
    } else if (score > 70 && score < 90) {
      newValue += (newValue / 10) ^ 1.35;
    }
    newValue = Math.round(this.clamp(newValue, 30, MAX_TIMER_VALUE * 60));
    isDevMode() ? console.log("The timer value increase from " + currentValue + "s to " + newValue + "s") : null;
    return newValue;
  }

  // Algorithm to compute the new timer value when the user go back (success)
  private computeNewDecreasedValue(): number {
    const currentValue = this.currentWebsite.timer || 30;
    const score = this.computeWebsiteScore(this.currentWebsite);
    let newValue = currentValue;

    if (score == -1) {
      newValue -= 10;
    } else {
      newValue -= Math.round((score ^ 2) / 250); // The higher the score, the more the timer dwindle
    }
    newValue = this.clamp(newValue, 30, MAX_TIMER_VALUE * 60);
    isDevMode() ? console.log("The timer value decreased from " + currentValue + "s to " + newValue + "s") : null;
    return newValue;
  }

  private getCurrentWebsite(website: string): watchedWebsite {
    website = this.removeWWW(website);

    const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == website);
    if (enforcedWebsite) {
      this.websiteOrigin = "Enforced";
      return enforcedWebsite;
    }

    const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == website);
    if (userWebsite) {
      this.websiteOrigin = "User";
      return userWebsite;
    }

    throw new Error("Website not found in chrome storage: " + website);
  }

  private removeWWW(website: string): string {
    if (website.substring(0, 3) == "www") return website.substring(4);
    return website;
  }

  private updateWebsiteAllowedDate(website: watchedWebsite) {
    const timeAllowed = isDevMode() ? 1 : DEFAULT_ALLOWED_DURATION;
    website.allowedUntil = new Date(Date.now() + timeAllowed * 60000).toString();
    website.timesAllowed++;
    isDevMode() ? console.log("Allowing " + website.host + " for " + timeAllowed + " min") : null;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
