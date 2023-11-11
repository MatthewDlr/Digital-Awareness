import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs';

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

  constructor() {
    chrome.storage.local.get(['pendingChanges'], (result) => {
      if (result['pendingChanges']) {
        const websitesToDelete = result['pendingChanges'].websitesToDelete;
        const websitesToEdit = result['pendingChanges'].websitesToEdit;

        this.pendingChanges = {
          areChangesPending: result['pendingChanges'].areChangesPending,
          validationDate: result['pendingChanges'].validationDate,
          websitesToDelete:
            websitesToDelete.length > 0 ? new Set(websitesToDelete) : new Set(),
          websitesToEdit:
            websitesToEdit.length > 0 ? new Set(websitesToEdit) : new Set(),
        };
        this.areChangesPending.next(this.pendingChanges.areChangesPending);

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
    console.log('Pending changes service initialized');
  }

  checkIfChangesCanBeValidated() {
    setInterval(() => {
      if (this.canBeValidated()) {
        this.canChangesBeValidated.next(true);
      } else {
        this.canChangesBeValidated.next(false);
        this.checkIfChangesCanBeValidated();
      }
    }, 1000 * 60);
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
    this.pendingChanges.websitesToDelete = new Set();
    this.pendingChanges.websitesToEdit.clear();
    this.savePendingChanges();
  }

  confirmPendingChanges() {
    throw new Error('Method not implemented.');
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
    const waitTimer = isDevMode() ? 1000 * 60 * 1 : 1000 * 60 * 60;
    this.pendingChanges.areChangesPending = true;
    this.pendingChanges.validationDate = new Date(
      new Date().getTime() + waitTimer,
    );
  }

  private savePendingChanges() {
    chrome.storage.local.set({ pendingChanges: this.pendingChanges });
    this.areChangesPending.next(this.pendingChanges.areChangesPending);
    console.log('Pending changes saved: ', this.pendingChanges);
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
