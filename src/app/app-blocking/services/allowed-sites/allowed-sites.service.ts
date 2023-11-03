import { Injectable } from '@angular/core';
import { allowedSite } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class AllowedSitesService {
  constructor() {}

  addAllowedSite(host: string, duration: number = 30): void {
    if (host.substring(0, 3) == "www") host = host.substring(4);

    // Setting up the allowed site
    const site: allowedSite = {
      host: host,
      allowedUntil: new Date(
        new Date().getTime() + duration * 60000
      ).toString(),
    };

    // Sync local storage
    chrome.storage.local.get('allowedSites', (result) => {
      let allowedSites: allowedSite[] = result['allowedSites'];
      allowedSites.push(site);
      chrome.storage.local.set({ allowedSites: allowedSites }, () => {
        console.log('Pushed sites: ', allowedSites);
      });
    });
  }
}
