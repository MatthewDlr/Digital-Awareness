import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types/types";
import { BehaviorSubject } from "rxjs";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Injectable({
  providedIn: "root",
})
export class PendingChangesService {
  stage: BehaviorSubject<stages> = new BehaviorSubject<stages>(stages.NoChanges);
  validationDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  websitesToDelete: Set<string> = new Set();
  websitesToEdit: Set<{ oldHost: string; newHost: string }> = new Set();

  timeout = isDevMode() ? 1000 * 5 : 1000 * 60;
  waitDuration = isDevMode() ? 1000 * 15 : 1000 * 60 * 60;

  constructor(private soundsEngine: SoundsEngineService) {
    chrome.storage.sync.get(["pendingChanges"]).then(result => {
      if (result["pendingChanges"]) {
        this.stage.next(result["pendingChanges"].stage || stages.NoChanges);
        this.validationDate.next(new Date(result["pendingChanges"].validationDate) || null);
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

    let userWebsites: watchedWebsite[] = [];
    await chrome.storage.sync
      .get(["userWebsites"])
      .catch(error => {
        this.soundsEngine.error();
        console.error("Cannot get user websites: ", error);
        return;
      })
      .then(result => {
        if (!result!["userWebsites"]) {
          this.soundsEngine.error();
          isDevMode() ? console.warn("No user websites found") : null;
          return;
        }
        userWebsites = result!["userWebsites"];
      });

    this.websitesToDelete.forEach(host => {
      userWebsites = userWebsites.filter(website => website.host !== host);
    });

    this.websitesToEdit.forEach(website => {
      userWebsites.forEach(userWebsite => {
        if (userWebsite.host === website.oldHost) {
          userWebsite.host = website.newHost;
        }
      });
    });

    chrome.storage.sync
      .set({ userWebsites: userWebsites })
      .then(() => {
        this.soundsEngine.success();
        this.discardPendingChanges();
      })
      .catch(error => {
        this.soundsEngine.error();
        console.error("Error while saving websites: ", error);
      });
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
    chrome.storage.sync.set({
      pendingChanges: {
        stage: this.stage.getValue(),
        validationDate: this.validationDate.getValue().toString(),
        websitesToDelete: Array.from(this.websitesToDelete),
        websitesToEdit: Array.from(this.websitesToEdit),
      },
    });

    if (isDevMode()) {
      chrome.storage.sync.get(["pendingChanges"], result => {
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
