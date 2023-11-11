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
  areChangesPending:Subject<boolean> = new Subject<boolean>();

  constructor() {
    chrome.storage.local.get(['pendingChanges'], (result) => {
      if (result['pendingChanges']) {
        this.pendingChanges = result['pendingChanges'];
        this.areChangesPending.next(this.pendingChanges.areChangesPending);
        console.log('Pending changes loaded: ', this.pendingChanges);
      }
    });
  }

  getValidationDate(): Date {
    return this.pendingChanges.validationDate as Date;
  }

  canBeValidated(): boolean {
    if (this.pendingChanges.validationDate) {
      if (this.pendingChanges.validationDate.getTime() < new Date().getTime()) {
        return true;
      }
    }
    return false;
  }

  addWebsiteToRemove(host: string) {
    this.pendingChanges.websitesToDelete.add(host);
    this.setPendingDuration();
    this.savePendingChanges();
  }

  addWebsiteToEdit(oldHost: string, newHost: string) {
    this.pendingChanges.websitesToEdit.add({ oldHost, newHost });
    this.setPendingDuration();
    this.savePendingChanges();
  }

  discardPendingChanges() {
    this.pendingChanges.areChangesPending = false;
    this.pendingChanges.validationDate = null;
    this.pendingChanges.websitesToDelete = new Set();
    this.pendingChanges.websitesToEdit = new Set();
    this.savePendingChanges();
  }

  confirmPendingChanges() {
    throw new Error('Method not implemented.');
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
