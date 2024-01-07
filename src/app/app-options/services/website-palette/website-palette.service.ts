import { Injectable, isDevMode } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WebsitePaletteService {
  isCommandPaletteShown: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.toggleCommandPalette(true);
    this.isCommandPaletteShown.subscribe(state =>
      isDevMode() ? console.log("Update command palette state: ", state) : null,
    );
  }

  toggleCommandPalette(state: boolean) {
    this.isCommandPaletteShown.next(state);
  }
}
