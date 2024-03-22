import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WatchedWebsite } from "app/types/watchedWebsite";
import { TensorflowService } from "app/services/tensorflow/tensorflow.service";
import { TfInput } from "app/types/tensorflow";
import dayjs, { Dayjs } from "dayjs";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website, defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  areWebsitesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enforcedWebsites!: WatchedWebsite[];
  userWebsites!: WatchedWebsite[];
  currentWebsite!: WatchedWebsite;
  websiteOrigin: string = "Enforced"; // Indicates if the website is blocked by default by the extension ("Enforced") or by the user ("User").

  constructor(private tfService: TensorflowService) {
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
    this.currentWebsite = this.getStoredWebsite(host);
    const minutesDiff = this.getMinutesSinceLastAccess(this.currentWebsite);
    const tfInput: TfInput = {
      minutes: minutesDiff,
      category: this.currentWebsite.category,
    };

    const timer = this.tfService.predict(tfInput);

    return isDevMode() ? 3 : timer;
  }

  private getMinutesSinceLastAccess(website: WatchedWebsite): number {
    const lastAccess = this.getLastAccess(website);
    const minutesDiff = dayjs().diff(lastAccess, "minutes");
    isDevMode() && console.log("There is " + minutesDiff + " between now and the last access");
    return minutesDiff;
  }

  private getLastAccess(website: WatchedWebsite): Dayjs {
    console.log(website.allowedAt);
    if (website.allowedAt) {
      return dayjs(website.allowedAt);
    }
    // If the variable is not defined, it's means that the website has never been allowed
    // We substract 7 days so the timer has the minimum value the first visit
    return dayjs().subtract(7, "day");
  }

  // This is called when the user choose to visit the website
  allowWebsiteTemporary(): void {
    const websiteAllowed: WatchedWebsite = this.getWebsiteFrom(this.currentWebsite.host);

    websiteAllowed.allowedUntil = dayjs().add(DEFAULT_ALLOWED_DURATION, "minute").toString();
    websiteAllowed.allowedAt = dayjs().toString();

    this.websiteOrigin == "Enforced"
      ? chrome.storage.sync.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
  }

  private getWebsiteFrom(host: string): WatchedWebsite {
    const website =
      this.websiteOrigin === "Enforced"
        ? this.enforcedWebsites.find(enforcedSite => enforcedSite.host == host)
        : this.userWebsites.find(userWebsite => userWebsite.host == host);

    if (!website) {
      throw new Error("Impossible to retrieve the following website from the local storage: " + host);
    }
    return website;
  }

  private getStoredWebsite(host: string): WatchedWebsite {
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
