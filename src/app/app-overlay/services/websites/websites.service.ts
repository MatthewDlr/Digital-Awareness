import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ScoringService } from "src/app/services/scoring/scoring.service";
import { watchedWebsite } from "src/app/types";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 1 : 30; // In minutes. When the user allow the website (aka failure), defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.
const DEFAULT_COOLDOWN_DURATION = isDevMode() ? 1 : 15; // In minutes. When the user clicks on "Go back" (aka success), defines the cooldown period before the timer will start be decreased again. (If not set, the user could just spam the button to increae it's score and dwindle the timer).

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  areWebsitesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enforcedWebsites!: watchedWebsite[];
  userWebsites!: watchedWebsite[];
  currentWebsite!: watchedWebsite;
  websiteOrigin: string = "Enforced"; // Indicates if the website is blocked by default by the extension ("Enforced") or by the user ("User").

  constructor(private scoringService: ScoringService) {
    chrome.storage.local
      .get("enforcedWebsites")
      .then(result => {
        this.enforcedWebsites = result["enforcedWebsites"] || [];
        this.checkIfWebsitesLoaded();
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });

    chrome.storage.sync
      .get("userWebsites")
      .then(result => {
        this.userWebsites = result["userWebsites"] || [];
        this.checkIfWebsitesLoaded();
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });
  }

  checkIfWebsitesLoaded() {
    if (this.enforcedWebsites && this.userWebsites) {
      this.areWebsitesLoaded.next(true);
      isDevMode() ? console.info("Websites correctly retrieved from chrome storage") : null;
    } else {
      this.areWebsitesLoaded.next(false);
    }
  }

  getTimerValue(host: string): number {
    this.currentWebsite = this.findCurrentWebsite(host);
    const timerValue = this.currentWebsite.timer;
    const nudgedValue = this.scoringService.nudgeTimerValue(this.currentWebsite);
    isDevMode() ? console.log("Timer value has been nudged from " + timerValue + "s to " + nudgedValue + "s") : null;

    if (isDevMode()) return 3;
    return nudgedValue;
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

    websiteAllowed.allowedUntil = new Date(Date.now() + DEFAULT_ALLOWED_DURATION * 60000).toString();
    websiteAllowed.timesAllowed++;
    websiteAllowed.timer = this.scoringService.computeNewIncreasedValue(this.currentWebsite);

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

    if (new Date(websiteBlocked.blockedAt).getTime() + DEFAULT_COOLDOWN_DURATION * 60000 > Date.now()) {
      isDevMode()
        ? alert("Website was blocked less than " + DEFAULT_COOLDOWN_DURATION + " minutes ago, not incrementing the counter")
        : null;
      return;
    }

    websiteBlocked.blockedAt = new Date().toString();
    websiteBlocked.timesBlocked++;
    websiteBlocked.timer = this.scoringService.computeNewDecreasedValue(this.currentWebsite);

    this.websiteOrigin == "Enforced"
      ? chrome.storage.local.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
  }

  private findCurrentWebsite(host: string): watchedWebsite {
    host = this.removeWWW(host);

    const enforcedWebsite = this.enforcedWebsites.find(enforcedSite => enforcedSite.host == host);
    if (enforcedWebsite) {
      this.websiteOrigin = "Enforced";
      return enforcedWebsite;
    }

    const userWebsite = this.userWebsites.find(userWebsite => userWebsite.host == host);
    if (userWebsite) {
      this.websiteOrigin = "User";
      return userWebsite;
    }

    throw new Error("Website not found in chrome storage: " + host);
  }

  private removeWWW(website: string): string {
    if (website.substring(0, 3) == "www") return website.substring(4);
    return website;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  private getDaysSinceLastAllowed(website: watchedWebsite): number {
    if (!website.allowedUntil) return 1;
    return this.clamp((Date.now() - new Date(website.allowedUntil).getTime()) / (1000 * 60 * 60 * 24), 1, 7);
  }
}
