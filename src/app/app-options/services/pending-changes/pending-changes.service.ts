import { Injectable } from '@angular/core';
import { watchedWebsite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class PendingChangesService {
  pendingChanges!: PendingChanges | null;

  constructor() {
    chrome.storage.local.get('pendingChanges').then((results) => {
      this.pendingChanges = results['pendingChanges'] || null;
    });
  }

  addWebsiteToPendingChanges(website: watchedWebsite) {
    if (this.pendingChanges) {
      this.pendingChanges.userWebsites.push(website);
      this.savePendingChanges();
    } else {
      this.createPendingChanges();
    }
  }

  createPendingChanges() {
    this.pendingChanges = {
      dateWhenChangesGetActive: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      userWebsites: [],
    };
  }

  savePendingChanges() {
    chrome.storage.local
      .set({ pendingChanges: this.pendingChanges })
      .catch((err) => {
        console.log('Unable to save pending changes: ', err);
      });
    console.log('Pending changes saved: ', this.pendingChanges);
  }

  canBeValidated(): boolean {
    if (this.pendingChanges) {
      return this.pendingChanges.dateWhenChangesGetActive > new Date();
    }
    return false;
  }

  clearPendingChanges() {
    this.pendingChanges = null;
    chrome.storage.local.remove('pendingChanges');
  }

  pushPendingChanges() {
    if (this.canBeValidated()) {
      return;
    }
    if (!this.pendingChanges) {
      return;
    }
    let userWebsites = this.pendingChanges.userWebsites;
    this.pushUserWebsites(userWebsites);
    
  }

  private pushUserWebsites(userWebsites: watchedWebsite[]){
    chrome.storage.sync.get('userWebsites').then((results) => {
      let currentWebsites: watchedWebsite[] = results['userWebsites'] || [];
      userWebsites.forEach((newWebsite) => {
        let existingWebsiteIndex = currentWebsites.findIndex(
          (currentWebsite) => currentWebsite.host === newWebsite.host,
        );
        if (existingWebsiteIndex !== -1) {
          currentWebsites[existingWebsiteIndex] = newWebsite;
        } else {
          currentWebsites.push(newWebsite);
        }
      });
      chrome.storage.sync.set({ userWebsites: currentWebsites }).then(() => {
        this.pendingChanges = null;
        chrome.storage.local.remove('pendingChanges');
      });
    });
  }
}

export type PendingChanges = {
  dateWhenChangesGetActive: Date;
  userWebsites: watchedWebsite[];
};
