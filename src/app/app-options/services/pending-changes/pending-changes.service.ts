import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { watchedWebsite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class PendingChangesService {
  areChangesPending: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  canChangesBeValidated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  validationDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  websitesToDelete: Set<string> = new Set();
  websitesToEdit: Set<{ oldHost: string; newHost: string }> = new Set();

  timeout = isDevMode() ? 1000 * 5 : 1000 * 60;
  waitDuration = isDevMode() ? 1000 * 15 : 1000 * 60 * 60;

  constructor() {
    chrome.storage.local.get(['pendingChanges'], (result) => {
      if (result['pendingChanges']) {
        this.areChangesPending.next(result['pendingChanges'].areChangesPending);
        this.validationDate.next(
          new Date(result['pendingChanges'].validationDate) || new Date(),
        );
        this.websitesToDelete = new Set(
          result['pendingChanges'].websitesToDelete,
        );
        this.websitesToEdit = new Set(result['pendingChanges'].websitesToEdit);

        isDevMode()
          ? console.log('Pending changes loaded: ', result['pendingChanges'])
          : null;
        this.checkChangesValidity();
      }
    });
  }

  checkChangesValidity() {
    if (!this.areChangesPending.getValue()) {
      isDevMode() ? console.log('No pending changes') : null;
      return;
    }

    if (this.canBeValidated()) {
      if (this.areChangesExpired()) {
        this.discardPendingChanges();
      } else {
        this.canChangesBeValidated.next(true);
        setTimeout(() => {
          this.checkChangesValidity();
        }, this.timeout);
      }
    } else {
      setTimeout(() => {
        this.checkChangesValidity();
      }, this.timeout);
    }
  }

  addWebsiteToRemove(host: string) {
    this.websitesToDelete.add(host);
    this.setPendingDuration();
    this.savePendingChanges();
  }

  addWebsiteToEdit(oldHost: string, newHost: string) {
    let doesWebsiteReplaceAnother = false;
    this.websitesToEdit.forEach((website) => {
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
    this.canChangesBeValidated.next(false);
    this.areChangesPending.next(false);
    this.savePendingChanges();
  }

  confirmPendingChanges() {
    if (!this.canBeValidated() || this.areChangesExpired() || !this.areChangesPending.getValue() ) {
      return;
    }

    chrome.storage.sync.get(['userWebsites'], (result) => {
      let userWebsites: watchedWebsite[] = result['userWebsites'] || [];
      this.websitesToDelete.forEach((host) => {
        userWebsites = userWebsites.filter((website) => website.host !== host);
      });

      this.websitesToEdit.forEach((website) => {
        userWebsites.forEach((userWebsite) => {
          if (userWebsite.host === website.oldHost) {
            userWebsite.host = website.newHost;
          }
        });
      });

      chrome.storage.sync.set({ userWebsites: userWebsites }).then(() => {
        this.discardPendingChanges();
      });
    });
  }

  private canBeValidated(): boolean {
    if (this.validationDate.getValue() < new Date()) {
      isDevMode() ? console.log('Changes can be validated') : null;
      return true;
    }
    isDevMode() ? console.log("Changes can't be validated yet") : null;
    return false;
  }

  private areChangesExpired(): boolean {
    const validUntil = new Date(
      this.validationDate.getValue().getTime() + this.waitDuration,
    );
    if (validUntil > new Date()) {
      return false;
    }
    return true;
  }

  private setPendingDuration() {
    this.areChangesPending.next(true);
    this.canChangesBeValidated.next(false);
    this.validationDate.next(
      new Date(new Date().getTime() + this.waitDuration),
    );
    this.checkChangesValidity();
  }

  private savePendingChanges() {
    chrome.storage.local.set({
      pendingChanges: {
        areChangesPending: this.areChangesPending.getValue(),
        validationDate: this.validationDate.getValue().toString(),
        websitesToDelete: Array.from(this.websitesToDelete),
        websitesToEdit: Array.from(this.websitesToEdit),
      },
    });

    if (isDevMode()) {
      chrome.storage.local.get(['pendingChanges'], (result) => {
        console.log('Pending changes saved: ', result['pendingChanges']);
      });
    }
  }
}
