import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs';
import { watchedWebsite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class PendingChangesService {
  pendingChanges: PendingChanges = {
    areChangesPending: false,
    validationDate: null,
    websitesToDelete: new Set(),
    websitesToEdit: new Set(),
  };
  areChangesPending: Subject<boolean> = new Subject<boolean>();
  canChangesBeValidated: Subject<boolean> = new Subject<boolean>();
  validationDate: Subject<Date> = new Subject<Date>();

  constructor() {
    chrome.storage.local.get(['pendingChanges'], (result) => {
      if (result['pendingChanges']) {
        const websitesToDelete = result['pendingChanges'].websitesToDelete;
        const websitesToEdit = result['pendingChanges'].websitesToEdit;
        const validationDate = result['pendingChanges'].validationDate;

        this.pendingChanges = {
          areChangesPending: result['pendingChanges'].areChangesPending,
          validationDate: validationDate != "" ? new Date(validationDate) : null,
          websitesToDelete:
            websitesToDelete.length > 0 ? new Set(websitesToDelete) : new Set(),
          websitesToEdit:
            websitesToEdit.length > 0 ? new Set(websitesToEdit) : new Set(),
        };
        this.areChangesPending.next(this.pendingChanges.areChangesPending);
        this.validationDate.next(this.pendingChanges.validationDate as Date);

        if (this.canBeValidated()) {
          this.canChangesBeValidated.next(true);
        } else {
          this.canChangesBeValidated.next(false);
          this.checkIfChangesCanBeValidated();
        }

        console.log(
          'Pending changes loaded: ',
          this.pendingChanges,
          '\n canBeValidated: ',
          this.canBeValidated(),
        );
      }
    });
  }

  checkIfChangesCanBeValidated() {
    if (!this.pendingChanges?.areChangesPending){
      console.log('No pending changes');
      return;
    }

    const waitTimer = isDevMode() ? 1000 * 5 : 1000 * 60 ;
    setInterval(() => {
      if (this.canBeValidated()) {
        this.canChangesBeValidated.next(true);
      } else {
        this.canChangesBeValidated.next(false);
        this.checkIfChangesCanBeValidated();
      }
    }, waitTimer);
  }

  getValidationDate(): Date {
    return this.pendingChanges.validationDate as Date;
  }

  addWebsiteToRemove(host: string) {
    this.pendingChanges.websitesToDelete.add(host);
    this.setPendingDuration();
    this.savePendingChanges();
  }

  addWebsiteToEdit(oldHost: string, newHost: string) {
    let doesWebsiteReplaceAnother = false;
    this.pendingChanges.websitesToEdit.forEach((website) => {
      if (website.newHost === oldHost) {
        website.newHost = newHost;
        doesWebsiteReplaceAnother = true;
      }
    });

    if (!doesWebsiteReplaceAnother) {
      this.pendingChanges.websitesToEdit.add({ oldHost, newHost });
    }
    this.setPendingDuration();
    this.savePendingChanges();
  }

  discardPendingChanges() {
    this.pendingChanges.areChangesPending = false;
    this.pendingChanges.validationDate = null;
    this.pendingChanges.websitesToDelete.clear();
    this.pendingChanges.websitesToEdit.clear();
    this.canChangesBeValidated.next(false);
    this.savePendingChanges();
  }

  confirmPendingChanges() {

    if (!this.canBeValidated()) {
      return;
    }

    chrome.storage.sync.get(['userWebsites'], (result) => {

      let userWebsites: watchedWebsite[] = result['userWebsites'] || [];
      this.pendingChanges.websitesToDelete.forEach((host) => {
        userWebsites = userWebsites.filter(
          (website) => website.host !== host,
        );
      });

      this.pendingChanges.websitesToEdit.forEach((website) => {
        userWebsites.forEach((userWebsite) => {
          if (userWebsite.host === website.oldHost) {
            userWebsite.host = website.newHost;
          }
        });
      });

      chrome.storage.sync.set({ userWebsites: userWebsites }, () => {
        this.discardPendingChanges();
      });
    });
  }

  private canBeValidated(): boolean {
    if (this.pendingChanges.validationDate instanceof Date) {
      if (this.pendingChanges.validationDate.getTime() < new Date().getTime()) {
        return true;
      }
    }
    return false;
  }

  private setPendingDuration() {
    const waitTimer = isDevMode() ? 1000 * 10 : 1000 * 60 * 60;
    this.pendingChanges.areChangesPending = true;
    this.pendingChanges.validationDate = new Date(
      new Date().getTime() + waitTimer,
    );
    this.validationDate.next(this.pendingChanges.validationDate);
    this.checkIfChangesCanBeValidated();
  }

  private savePendingChanges() {
    const pendingChangesSave = {
      areChangesPending: this.pendingChanges.areChangesPending,
      validationDate: this.pendingChanges.validationDate?.toString() || "",
      websitesToDelete: Array.from(this.pendingChanges.websitesToDelete),
      websitesToEdit: Array.from(this.pendingChanges.websitesToEdit),
    }
    chrome.storage.local.set({ pendingChanges: pendingChangesSave });
    this.areChangesPending.next(this.pendingChanges.areChangesPending);
    console.log('Pending changes saved: ', pendingChangesSave);
  }
}

export type PendingChanges = {
  areChangesPending: boolean;
  validationDate: Date | null;
  websitesToDelete: Set<string>;
  websitesToEdit: Set<{
    oldHost: string;
    newHost: string;
  }>;
};
