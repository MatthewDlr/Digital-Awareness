import { Component, HostListener } from '@angular/core';
import { watchedWebsite } from 'src/app/types';
import { CommandPaletteService } from '../services/command-palette/command-palette.service';
import { Website } from '../options-components/websites-list';

@Component({
  selector: 'app-blocklist-tab',
  templateUrl: './blocklist-tab.component.html',
  styleUrls: ['./blocklist-tab.component.css'],
})
export class BlocklistTabComponent {
  isLoading: boolean = true;
  enforcedWebsites: watchedWebsite[] = []
  userWebsites: watchedWebsite[] = []
  isCommandPaletteShown: boolean = false;
  randomWidths: any[] = [];
  editIndex!: number ;


  constructor(private commandPaletteService: CommandPaletteService) {
    this.getWebsites();
    this.generateRandomWidth();
    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: (state) => (this.isCommandPaletteShown = state),
    });
  }

  // Listen for the cmd+k/ctrl+k to toggle the command palette
  @HostListener('document:keydown.meta.k', ['$event'])
  @HostListener('document:keydown.control.k', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.toggleCommandPalette(true);
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
    return '-';
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

  setEditIndex(index: number) {
    this.editIndex = index;
  }

  removeWebsite(websiteToDelete: watchedWebsite){
    this.userWebsites = this.userWebsites.filter((website) => website.host !== websiteToDelete.host);
  }
}
