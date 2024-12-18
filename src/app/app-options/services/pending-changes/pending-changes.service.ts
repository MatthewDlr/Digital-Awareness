import { Injectable, isDevMode } from "@angular/core";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { getRestrictedWebsites, setRestrictedWebsites } from "app/shared/chrome-storage-api";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PendingChangesService {
  stage: BehaviorSubject<stages> = new BehaviorSubject<stages>(stages.NoChanges);
  validationDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  websitesToDelete = new Set<string>();
  websitesToEdit = new Set<{ oldHost: string; newHost: string }>();

  timeout = isDevMode() ? 1000 * 5 : 1000 * 60;
  waitDuration = isDevMode() ? 1000 * 15 : 1000 * 60 * 60;

  constructor(private soundsEngine: SoundsEngineService) {
    chrome.storage.local.get(["pendingChanges"]).then(result => {
      if (result["pendingChanges"]) {
        this.stage.next(result["pendingChanges"].stage || stages.NoChanges);
        const validationDate = result["pendingChanges"].validationDate
          ? new Date(result["pendingChanges"].validationDate)
          : null;
        if (!validationDate) return;

        this.validationDate.next(validationDate);
        this.websitesToDelete = new Set(result["pendingChanges"].websitesToDelete);
        this.websitesToEdit = new Set(result["pendingChanges"].websitesToEdit);

        isDevMode() ? console.log("Pending changes loaded: ", result["pendingChanges"]) : null;
        this.checkChangesValidity();
      }
    });
  }

  addWebsiteToRemove(host: string) {
    this.websitesToDelete.add(host);
    this.setPendingDuration();
    this.savePendingChanges();
  }

  isWebsitePending(host: string): boolean {
    if (this.websitesToDelete.has(host)) {
      return true;
    }
    // @ts-expect-error: Not all code paths return a value.
    this.websitesToEdit.forEach(website => {
      if (website.oldHost === host || website.newHost === host) {
        return true;
      }
    });
    return false;
  }

  addWebsiteToEdit(oldHost: string, newHost: string) {
    let doesWebsiteReplaceAnother = false;
    this.websitesToEdit.forEach(website => {
      if (website.newHost === oldHost) {
        website.newHost = newHost;
        doesWebsiteReplaceAnother = true;
      }
    });

    if (!doesWebsiteReplaceAnother) {
      this.websitesToEdit.add({ oldHost, newHost });
    }
    this.setPendingDuration();
    this.savePendingChanges();
  }

  discardPendingChanges() {
    this.websitesToDelete.clear();
    this.websitesToEdit.clear();
    this.stage.next(stages.NoChanges);
    this.savePendingChanges();
  }

  async confirmPendingChanges() {
    if (this.stage.getValue() != stages.ChangesCanBeValidated) {
      isDevMode() ? console.warn("Changes can not be validated") : null;
      return;
    }

    const restrictedWebsites = await getRestrictedWebsites();
    this.websitesToDelete.forEach(host => {
      restrictedWebsites.delete(host);
    });

    this.websitesToEdit.forEach(website => {
      const restrictedWebsite = restrictedWebsites.get(website.oldHost);
      restrictedWebsites.delete(website.oldHost);

      if (restrictedWebsite) {
        restrictedWebsite.host = website.newHost;
        restrictedWebsites.set(website.newHost, restrictedWebsite);
      }
    });

    await setRestrictedWebsites(restrictedWebsites);
    this.soundsEngine.success();
    this.discardPendingChanges();
  }

  private checkChangesValidity() {
    if (this.stage.getValue() === stages.NoChanges) {
      isDevMode() ? console.log("No pending changes") : null;
      return;
    }

    if (this.stage.getValue() === stages.ChangesPending) {
      if (this.canBeValidated()) {
        this.soundsEngine.alert();
        this.stage.next(stages.ChangesCanBeValidated);
      }
    }

    if (this.stage.getValue() === stages.ChangesCanBeValidated) {
      if (this.areChangesExpired()) {
        this.soundsEngine.erase();
        this.discardPendingChanges();
        return;
      }
    }

    setTimeout(() => {
      this.checkChangesValidity();
    }, this.timeout);
  }

  private canBeValidated(): boolean {
    if (this.validationDate.getValue() < new Date()) {
      isDevMode() ? console.log("Changes can be validated") : null;
      return true;
    }
    isDevMode() ? console.log("Changes can't be validated yet") : null;
    return false;
  }

  private areChangesExpired(): boolean {
    const validUntil = new Date(this.validationDate.getValue().getTime() + this.waitDuration);
    if (validUntil > new Date()) {
      return false;
    }
    return true;
  }

  private setPendingDuration() {
    this.stage.next(stages.ChangesPending);
    this.validationDate.next(new Date(new Date().getTime() + this.waitDuration));
    this.checkChangesValidity();
  }

  private savePendingChanges() {
    chrome.storage.local.set({
      pendingChanges: {
        stage: this.stage.getValue(),
        validationDate: this.validationDate.getValue().toString(),
        websitesToDelete: Array.from(this.websitesToDelete),
        websitesToEdit: Array.from(this.websitesToEdit),
      },
    });

    if (isDevMode()) {
      chrome.storage.local.get(["pendingChanges"], result => {
        isDevMode() ? console.log("Pending changes saved: ", result["pendingChanges"]) : null;
      });
    }
  }
}

export enum stages {
  // Value are used as a string because they are used in the html template
  NoChanges = "NoChanges",
  ChangesPending = "ChangesPending",
  ChangesCanBeValidated = "ChangesCanBeValidated",
}
