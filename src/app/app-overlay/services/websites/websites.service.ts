import { computed, Injectable, isDevMode, Signal, signal } from "@angular/core";
import { getRestrictedWebsites, setRestrictedWebsites } from "app/shared/chrome-storage-api";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";
import dayjs from "dayjs";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website, defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  private currentWebsite!: RestrictedWebsite;
  private restrictedWebsites = signal(new Map<string, RestrictedWebsite>());
  isReady: Signal<boolean> = computed(() => this.restrictedWebsites().size > 0);

  constructor() {
    getRestrictedWebsites().then(restrictedWebsites => {
      this.restrictedWebsites.set(restrictedWebsites);
    });
  }

  getTimerValue(host: string): number {
    this.currentWebsite = this.getStoredWebsite(host);
    const minutesSinceLastAccess = this.getMinutesSinceLastAccess(this.currentWebsite.allowedAt);
    return this.computeTimer(minutesSinceLastAccess);
  }

  private getStoredWebsite(host: string): RestrictedWebsite {
    host = host.replace("www.", "");
    const userWebsite = this.restrictedWebsites().get(host);
    if (userWebsite) return userWebsite;

    throw new Error("Website not found in chrome storage: " + host);
  }

  private computeTimer(minutesSinceLastAccess: number): number {
    const maxTimer = 3 * 60; // 3 minutes in seconds
    const minTimer = 15; // 15 seconds

    // Calculate the timer using an inverse relationship
    let timer = maxTimer / (1 + minutesSinceLastAccess / 300);

    timer = Math.round(Math.max(timer, minTimer));
    if (isDevMode()) {
      console.log("Timer: ", timer);
      return 3;
    }
    return timer;
  }

  private getMinutesSinceLastAccess(allowedAt: string): number {
    return dayjs().diff(dayjs(allowedAt), "minutes");
  }

  // This is called when the user choose to visit the website
  public allowWebsiteTemporary(): void {
    this.currentWebsite.allowedUntil = dayjs().add(DEFAULT_ALLOWED_DURATION, "minute").toString();
    this.currentWebsite.allowedAt = dayjs().toString();

    this.updateWebsites(this.currentWebsite);
  }

  private updateWebsites(websiteAllowed: RestrictedWebsite) {
    this.restrictedWebsites.update(restrictedWebsiteMap => {
      restrictedWebsiteMap.set(websiteAllowed.host, websiteAllowed);
      return restrictedWebsiteMap;
    });
    setRestrictedWebsites(this.restrictedWebsites());
  }
}
