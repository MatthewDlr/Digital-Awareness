import { effect, Injectable, isDevMode, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class WebsitePaletteService {
  isCommandPaletteShown: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      isDevMode() && console.log("Command palette state changed:", this.isCommandPaletteShown());
    });
  }

  toggleCommandPalette(state: boolean) {
    this.isCommandPaletteShown.set(state);
  }
}
