import { Component, isDevMode } from '@angular/core';
import { CommandPaletteService } from '../services/command-palette/command-palette.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  currentTab: string = 'blocklist';
  isCommandPaletteShown: boolean = false;

  constructor(public commandPaletteService: CommandPaletteService) {
    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: (state) => {
        this.isCommandPaletteShown = state;
      },
    });
  }

  isDevModeEnabled() {
    return isDevMode();
  }
}
