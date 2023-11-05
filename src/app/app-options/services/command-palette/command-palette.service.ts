import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommandPaletteService {
  isCommandPaletteShown: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.toggleCommandPalette(true);
    this.isCommandPaletteShown.subscribe(state => console.log('Update command palette state: ', state));
  }

  toggleCommandPalette(state: boolean) {
    this.isCommandPaletteShown.next(state);
  }
}
