import { Component} from '@angular/core';
import { blockedSite } from 'src/app/types';
import { CommandPaletteService } from '../services/command-palette/command-palette.service';

@Component({
  selector: 'app-blocklist-tab',
  templateUrl: './blocklist-tab.component.html',
  styleUrls: ['./blocklist-tab.component.css'],
})
export class BlocklistTabComponent {
  isLoading: boolean = true;
  blockedWebsites: blockedSite[] = [];
  isCommandPaletteShown: boolean = false;
  randomWidths: any[] = [];

  constructor(
    private commandPaletteService: CommandPaletteService,
  ) {
    chrome.storage.sync.get('blockedWebsites').then((result) => {
      this.blockedWebsites = result['blockedWebsites'];
      this.isLoading = false;
    });
    this.generateRandomWidth()
    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: (state) => this.isCommandPaletteShown = state
    })
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  computeBlockedScore(website: blockedSite): string {
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
}
