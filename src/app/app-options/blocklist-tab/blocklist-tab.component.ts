import { Component, HostListener } from '@angular/core';
import { watchedWebsite } from 'src/app/types';
import { CommandPaletteService } from '../services/command-palette/command-palette.service';
import { PendingChangesService } from '../services/pending-changes/pending-changes.service';
@Component({
  selector: 'app-blocklist-tab',
  templateUrl: './blocklist-tab.component.html',
  styleUrls: ['./blocklist-tab.component.css'],
})
export class BlocklistTabComponent {
  isLoading: boolean = true;
  enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];
  isCommandPaletteShown: boolean = false;
  randomWidths: any[] = [];

  editIndex: number = -1;
  oldHost!: string;

  constructor(
    private commandPaletteService: CommandPaletteService,
    private pendingChangesService: PendingChangesService,
  ) {
    this.getWebsites();
    this.generateRandomWidth();
    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: (state) => {
        this.isCommandPaletteShown = state;
        if (!state){
          setTimeout(() => {
            this.getWebsites();
          }, 100);
        }
      },
    });
    this.pendingChangesService.areChangesPending.subscribe({
      next: (state) => {
        if (!state) {
          this.getWebsites();
        }
      },
    });
  }

  // Listen for the cmd+k/ctrl+k to toggle the command palette
  @HostListener('document:keydown.meta.k', ['$event'])
  @HostListener('document:keydown.control.k', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.toggleCommandPalette(true);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterHandler(event: KeyboardEvent) {
    this.editWebsite(this.userWebsites[this.editIndex]);
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  computeBlockedScore(website: watchedWebsite): string {
    let score =
      (website.timesBlocked * 100) /
      (website.timesBlocked + website.timesAllowed);
    if (score) {
      score = Math.round(score);
      return score + '%';
    }
    return 'Never blocked';
  }

  generateRandomWidth() {
    for (let i = 0; i < 6; i++) {
      let rowValues = [];
      for (let c = 0; c < 3; c++) {
        const randomPercentage = Math.floor(Math.random() * 60) + 30; // generates a random number between 30 and 90
        rowValues.push(`${randomPercentage}%`);
      }
      this.randomWidths.push(rowValues);
    }
  }

  getWebsites() {
    Promise.all([
      chrome.storage.local.get('enforcedWebsites'),
      chrome.storage.sync.get('userWebsites'),
    ]).then(([enforcedResult, userResult]) => {
      this.enforcedWebsites = enforcedResult['enforcedWebsites'] || [];
      this.userWebsites = userResult['userWebsites'] || [];
    });
  }

  enableEdit(index: number, websiteToEdit: watchedWebsite) {
    this.editIndex = index;
    this.oldHost = websiteToEdit.host;
  }

  editWebsite(websiteToEdit: watchedWebsite) {
    websiteToEdit.host = websiteToEdit.host.trim();
    if (this.editIndex === -1 || websiteToEdit.host === '') {
      return;
    }

    this.editIndex = -1;
    if (this.oldHost !== websiteToEdit.host) {
      this.pendingChangesService.addWebsiteToEdit(
        this.oldHost,
        websiteToEdit.host,
      );
    }
  }

  removeWebsite(websiteToDelete: watchedWebsite) {
    this.userWebsites = this.userWebsites.filter(
      (website) => website.host !== websiteToDelete.host,
    );
    this.pendingChangesService.addWebsiteToRemove(websiteToDelete.host);
  }
}
