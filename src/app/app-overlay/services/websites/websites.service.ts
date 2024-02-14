import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ScoringService } from "src/app/services/scoring/scoring.service";
import { watchedWebsite } from "src/app/types/types";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website (aka failure), defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.
const DEFAULT_COOLDOWN_DURATION = isDevMode() ? 1 : 30; // In minutes. When the user clicks on "Go back" (aka success), defines the cooldown period before the timer will start be decreased again. (If not set, the user could just spam the button to increase it's score and dwindle the timer).
const PREVENT_FRAUD_DURATION = isDevMode() ? 1 : 15; // In minutes. If the user clicks on "Go back" but then wait reopen the same website and wait the cooldown, this value measure the time between these two events. If it's too short, it means that the user can keep a fair score by clicking on "Go back" just before reopen and accessing the website.

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
    chrome.storage.sync
      .get(["enforcedWebsites", "userWebsites"])
      .then(result => {
        this.enforcedWebsites = result["enforcedWebsites"] || [];
        this.userWebsites = result["userWebsites"] || [];
        this.areWebsitesLoaded.next(true);
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });
  }

  getTimerValue(host: string): number {
    this.currentWebsite = this.findCurrentWebsite(host);
    const nudgedValue = this.scoringService.nudgeTimerValue(this.currentWebsite);
    isDevMode() ? console.log("Timer has been nudged from " + this.currentWebsite.timer + "s to " + nudgedValue + "s") : null;

    return isDevMode() ? 3 : nudgedValue;
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

    websiteAllowed.timesAllowed += this.scoringService.getAllowedCoef(websiteAllowed);
    websiteAllowed.allowedUntil = new Date(Date.now() + DEFAULT_ALLOWED_DURATION * 60000).toString();
    websiteAllowed.timer = this.scoringService.computeNewIncreasedValue(this.currentWebsite);

    // If the user went back (blocked) just before allowing the website, it could means that he's trying to keep a fair score, so we decrement the timesBlocked counter.
    if (new Date(websiteAllowed.blockedAt).getTime() + PREVENT_FRAUD_DURATION * 60000 > Date.now()) {
      isDevMode() ? alert("Website was already blocked less than " + PREVENT_FRAUD_DURATION + " minutes ago") : null;
      websiteAllowed.timesBlocked--;
    }

    this.websiteOrigin == "Enforced"
      ? chrome.storage.sync.set({ enforcedWebsites: this.enforcedWebsites })
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
      isDevMode() ? alert("Website was blocked less than " + DEFAULT_COOLDOWN_DURATION + " minutes ago") : null;
      return;
    }

    websiteBlocked.timesBlocked++;
    websiteBlocked.blockedAt = new Date().toString();
    websiteBlocked.timer = this.scoringService.computeNewDecreasedValue(this.currentWebsite);

    this.websiteOrigin == "Enforced"
      ? chrome.storage.sync.set({ enforcedWebsites: this.enforcedWebsites })
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
}
