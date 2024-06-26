import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject, filter, firstValueFrom } from "rxjs";
import { WatchedWebsite } from "app/types/watchedWebsite.type";
import dayjs, { Dayjs } from "dayjs";
import { WebsiteAccessService } from "app/services/Tensorflow/Website Access/website-access.service";
import { WebsiteAccessInput } from "app/services/Tensorflow/models/WebsiteAccess.model";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website, defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  isReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enforcedWebsites!: WatchedWebsite[];
  userWebsites!: WatchedWebsite[];
  currentWebsite!: WatchedWebsite;
  websiteOrigin: string = "Enforced"; // Indicates if the website is blocked by default by the extension ("Enforced") or by the user ("User").

  constructor(private websiteAccess: WebsiteAccessService) {
    chrome.storage.sync
      .get(["enforcedWebsites", "userWebsites"])
      .then(result => {
        this.enforcedWebsites = result["enforcedWebsites"] || [];
        this.userWebsites = result["userWebsites"] || [];
        this.isReady.next(true);
      })
      .catch(error => {
        isDevMode() ? console.error(error) : null;
      });
  }

  async getTimerValue(host: string): Promise<number> {
    this.currentWebsite = this.getStoredWebsite(host);
    const minutesDiff = this.getMinutesSinceLastAccess(this.currentWebsite);
    const input: WebsiteAccessInput = {
      minutes: minutesDiff,
      category: this.currentWebsite.category,
    };
    await firstValueFrom(this.websiteAccess.trainingProgress.pipe(filter(value => value === 100)));
    const timer = await this.websiteAccess.predict(input);
    return timer;
  }

  private getMinutesSinceLastAccess(website: WatchedWebsite): number {
    const lastAccess = this.getLastAccess(website);
    const minutesDiff = dayjs().diff(lastAccess, "minutes");
    isDevMode() && console.log("There is " + minutesDiff + " min between now and the last access");
    return minutesDiff;
  }

  private getLastAccess(website: WatchedWebsite): Dayjs {
    if (website.allowedAt) {
      return dayjs(website.allowedAt);
    }
    // If the variable is not defined, it's means that the website has never been allowed
    // We substract 7 days so the timer has the minimum value the first visit
    return dayjs().subtract(7, "day");
  }

  // This is called when the user choose to visit the website
  allowWebsiteTemporary(): void {
    const websiteAllowed: WatchedWebsite = this.currentWebsite;

    websiteAllowed.allowedUntil = dayjs().add(DEFAULT_ALLOWED_DURATION, "minute").toString();
    websiteAllowed.allowedAt = dayjs().toString();

    this.websiteOrigin === "Enforced"
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
