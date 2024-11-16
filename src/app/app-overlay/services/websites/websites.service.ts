import { computed, effect, Injectable, isDevMode, Signal, signal } from "@angular/core";
import { filter, firstValueFrom } from "rxjs";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";
import dayjs from "dayjs";
import { WebsiteAccessService } from "app/services/Tensorflow/Website Access/website-access.service";
import { WebsiteAccessInput } from "app/services/Tensorflow/models/WebsiteAccess.model";
import { getRestrictedWebsites, setRestrictedWebsites } from "app/shared/chrome-storage-api";

const DEFAULT_ALLOWED_DURATION = isDevMode() ? 0.5 : 30; // In minutes. When the user allow the website, defines the duration for which the website is whitelisted and accessible without having to wait for the timer to expire.

@Injectable({
  providedIn: "root",
})
export class WebsitesService {
  private currentWebsite!: RestrictedWebsite;
  private restrictedWebsites = signal(new Map<string, RestrictedWebsite>());
  isReady: Signal<boolean> = computed(() => this.restrictedWebsites().size > 0);

  constructor(private websiteAccess: WebsiteAccessService) {
    getRestrictedWebsites().then(restrictedWebsites => {
      this.restrictedWebsites.set(restrictedWebsites);
    });

    effect(() => {
      console.log(this.restrictedWebsites());
    });
  }

  async getTimerValue(host: string): Promise<number> {
    this.currentWebsite = this.getStoredWebsite(host);
    const minutesDiff = this.getMinutesSinceLastAccess(this.currentWebsite);
    if (minutesDiff > 7 * 24 * 60) return 0;

    const input: WebsiteAccessInput = {
      minutes: minutesDiff,
      category: this.currentWebsite.category,
    };
    await firstValueFrom(this.websiteAccess.trainingProgress.pipe(filter(value => value === 100)));
    const timer = await this.websiteAccess.predict(input);
    return timer;
  }

  private getMinutesSinceLastAccess(website: RestrictedWebsite): number {
    if (!website.allowedAt) return Infinity;

    const lastAccess = dayjs(website.allowedAt);
    const minutesDiff = dayjs().diff(lastAccess, "minutes");
    return minutesDiff;
  }

  // This is called when the user choose to visit the website
  allowWebsiteTemporary(): void {
    const websiteAllowed: RestrictedWebsite = this.currentWebsite;

    websiteAllowed.allowedUntil = dayjs().add(DEFAULT_ALLOWED_DURATION, "minute").toString();
    websiteAllowed.allowedAt = dayjs().toString();

    this.updateWebsites(websiteAllowed);
  }

  private updateWebsites(websiteAllowed: RestrictedWebsite) {
    this.restrictedWebsites.update(restrictedWebsiteMap => {
      restrictedWebsiteMap.set(websiteAllowed.host, websiteAllowed);
      return restrictedWebsiteMap;
    });
    setRestrictedWebsites(this.restrictedWebsites());
  }

  private getStoredWebsite(host: string): RestrictedWebsite {
    host = this.removeWWW(host);

    const userWebsite = this.restrictedWebsites().get(host);
    if (userWebsite) return userWebsite;

    throw new Error("Website not found in chrome storage: " + host);
  }

  private removeWWW(website: string): string {
    if (website.substring(0, 3) == "www") return website.substring(4);
    return website;
  }
}
