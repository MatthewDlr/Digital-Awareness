import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WatchedWebsite } from "app/types/watchedWebsite";
import { TensorflowService } from "app/services/tensorflow/tensorflow.service";
import { TfInput } from "app/types/tensorflow";
import dayjs, { Dayjs } from "dayjs";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website (aka failure), defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.

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
    return dayjs().subtract(7, "day");
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

    websiteAllowed.allowedUntil = dayjs().add(DEFAULT_ALLOWED_DURATION, "minute").toString();
    websiteAllowed.allowedAt = dayjs().toString();

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

    websiteBlocked.allowedAt = dayjs().toString();
    console.log("Allowed at: " + websiteBlocked.allowedAt);

    this.websiteOrigin == "Enforced"
      ? chrome.storage.sync.set({ enforcedWebsites: this.enforcedWebsites })
      : chrome.storage.sync.set({ userWebsites: this.userWebsites });
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
