import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

const DEFAULT_TIMER_VALUE = isDevMode() ? 3 : 30; // In seconds. This is the default value for the timer when the user has to wait to access the website.
const DEFAULT_ALLOWED_DURATION = isDevMode() ? 1 : 30; // In minutes. When the user allow the website (aka failure), this defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.
const DEFAULT_INTERVAL_DURATION = isDevMode() ? 1 : 15; // In minutes. When the user clicks on "Go back" (aka success), this defines the cooldown period before the extension considers a new activation of this button.
const MAX_TIMER_VALUE = 3; // In minutes. This specifies the maximum value the timer can be set to, regardless of user actions.
const INCREASE_COEF = 1; // The higher the value, the more aggressively the timer value increases.

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  enforcedWebsites!: watchedWebsite[];
  userWebsites!: watchedWebsite[];
  currentWebsite!: watchedWebsite;
  websiteOrigin: string = "Enforced"; // Indicates if the website is blocked by default by the extension ("Enforced") or by the user ("User").

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
    if (isDevMode()) return DEFAULT_TIMER_VALUE;

    let timerValue = this.currentWebsite.timer || DEFAULT_TIMER_VALUE;
    const score = this.computeWebsiteScore(this.currentWebsite);

    // The timer value remains unchanged if the user has not interacted with the website sufficiently.
    if (score == -1) return timerValue;

    // If the user has a low score, we increase the timer value as a nudge to encourage the user to go back.
    if (score < 10) {
      timerValue *= 1.75 * INCREASE_COEF;
    } else if (score < 20) {
      timerValue *= 1.5 * INCREASE_COEF;
    } else if (score < 30) {
      timerValue *= 1.25 * INCREASE_COEF;
    }

    // If the user has a high score, we slightly reduce the timer value to indicate that accessing the website is OK.
    else if (score > 90) {
      timerValue /= 1.25;
    } else if (score > 80) {
      timerValue /= 1.1;
    }

    // We adjust the timer value based on the last time the user allowed access to the website.
    // If he allowed access 1 day ago, then the timer remains unchanged; however, if the last allowance was 7 days ago, the value is divided by 1.49
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(this.currentWebsite);
    const dayCoef = daysSinceLastAllowed ** 2 / 100 + 1;
    timerValue /= dayCoef;

    return Math.round(timerValue);
  }

  // This is called when the user chooses to visit the website, it counts as a 'failure.'
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

  // This is called when the user chooses to click on "Go back", it counts as a 'success'
  incrementTimesBlocked() {
    const websiteBlocked =
      this.websiteOrigin == "Enforced"
        ? this.enforcedWebsites.find(enforcedSite => enforcedSite.host == this.currentWebsite.host)
        : this.userWebsites.find(userWebsite => userWebsite.host == this.currentWebsite.host);

    if (!websiteBlocked) {
      isDevMode() ? console.error("Failed to retrieve the website from chrome storage: ", this.currentWebsite) : null;
      return;
    }

    if (new Date(websiteBlocked.blockedAt).getTime() + DEFAULT_INTERVAL_DURATION * 60000 > Date.now()) {
      isDevMode()
        ? alert("Website was blocked less than " + DEFAULT_INTERVAL_DURATION + " minutes ago, not incrementing the counter")
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

  // Returns a score ranging from 0 to 100 aiming to assess the user's current habit concerning this website.
  // If there is not enough data to compute a reliable score, -1 is returned.
  computeWebsiteScore(website: watchedWebsite): number {
    const accuracy = website.timesBlocked + website.timesAllowed;
    if (accuracy < 5) return -1;

    const websiteScore = 210 * Math.log10((website.timesBlocked - website.timesAllowed) / accuracy + 2);
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    const lastAllowedScore = Math.log2(daysSinceLastAllowed * 4);

    const score = this.clamp(Math.round(websiteScore + lastAllowedScore), 0, 100);
    isDevMode() ? console.log("Website Score for " + website.host + " is " + score) : null;
    return score;
  }

  // Algorithm to compute the new timer value when the user allows a website (failure)
  private computeNewIncreasedValue(): number {
    const currentValue = this.currentWebsite.timer || DEFAULT_TIMER_VALUE;
    const score = this.computeWebsiteScore(this.currentWebsite);
    let newValue = currentValue;

    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(this.currentWebsite);
    if (daysSinceLastAllowed >= 6) return currentValue; // If the user has not allowed the website for 6 days or more, we do not increase the timer value because it's likely that he has good habits.

    // The lower the score, the more aggressive the increase function becomes.
    if (score == -1 || (score >= 30 && score <= 70)) {
      newValue += (newValue / 10) ** 1.75 * INCREASE_COEF; // Default increase function.
    } else if (score < 30 && score > 15) {
      newValue += (newValue / 10) ** 2.25 * INCREASE_COEF;
    } else if (score <= 15) {
      newValue += (newValue / 10) ** 2.5 * INCREASE_COEF;
    } else if (score > 70 && score < 90) {
      newValue += (newValue / 10) ** 1.4 * INCREASE_COEF;
    }
    newValue = Math.round(this.clamp(newValue, 30, MAX_TIMER_VALUE * 60));
    isDevMode()
      ? alert("The timer value increased from " + currentValue + "s to " + newValue + "s" + " (score: " + score + ")")
      : null;

    return newValue;
  }

  // Algorithm to compute the new timer value when the user goes back (success)
  private computeNewDecreasedValue(): number {
    const currentValue = this.currentWebsite.timer || DEFAULT_TIMER_VALUE;
    const score = this.computeWebsiteScore(this.currentWebsite);
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(this.currentWebsite);
    let newValue = currentValue;

    if (daysSinceLastAllowed >= 6) return DEFAULT_TIMER_VALUE; // If last access was 6 days ago or more, then it's likely that the user has good habits, so we set the timer to the default value.

    const adjust = daysSinceLastAllowed / 10 - 0.1; // Return a value between 0 and 0.4 based on the last time the user allowed the website.
    const coef = Math.max(Math.log10(score) - 0.5, 0); // Return a value between 0 and 1.5 based on the score.
    newValue = Math.round(newValue / (coef + adjust));
    newValue = this.clamp(newValue, 30, MAX_TIMER_VALUE * 60);

    isDevMode()
      ? alert("The timer value decreased from " + currentValue + "s to " + newValue + "s" + " (score: " + score + ")")
      : null;
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
    website.allowedUntil = new Date(Date.now() + DEFAULT_ALLOWED_DURATION * 60000).toString();
    website.timesAllowed++;
    isDevMode() ? console.log("Allowing " + website.host + " for " + DEFAULT_ALLOWED_DURATION + " min") : null;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  private getDaysSinceLastAllowed(website: watchedWebsite): number {
    return this.clamp((Date.now() - new Date(website.allowedUntil).getTime()) / (1000 * 60 * 60 * 24), 1, 7);
  }
}
