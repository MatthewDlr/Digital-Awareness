import { Component, HostListener, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";
import { CommandPaletteService } from "../services/command-palette/command-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";
import { HighlightedWebsitesRowComponent } from "../components/highlighted-websites-row/highlighted-websites-row.component";

@Component({
  selector: "app-highlighted-websites-option",
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightedWebsitesRowComponent],
  templateUrl: "./highlighted-websites-option.component.html",
  styleUrls: ["./highlighted-websites-option.component.css"],
})
export class HighlightedWebsitesOptionComponent {
  enforcedWebsites!: watchedWebsite[];
  userWebsites!: watchedWebsite[];
  isCommandPaletteShown: boolean = false;
  OS: string = this.getOS();

  constructor(
    private soundsEngine: SoundsEngineService,
    private commandPaletteService: CommandPaletteService,
    private pendingChangesService: PendingChangesService,
  ) {
    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: state => {
        this.isCommandPaletteShown = state;
        if (!state) {
          setTimeout(() => {
            this.getWebsites();
          }, 100);
        }
      },
    });
    this.pendingChangesService.stage.subscribe({
      next: () => {
        this.getWebsites();
      },
    });
  }

  // Listen for the cmd+k/ctrl+k to toggle the command palette
  @HostListener("document:keydown.meta.k", ["$event"])
  @HostListener("document:keydown.control.k", ["$event"])
  onKeydownHandler() {
    this.toggleCommandPalette(true);
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
    this.soundsEngine.pop();
  }

  getWebsites() {
    chrome.storage.local.get("enforcedWebsites").then(result => {
      this.enforcedWebsites = result["enforcedWebsites"] || [];
      isDevMode() ? console.log("Enforced Websites successfully fetched") : null;
    });

    chrome.storage.sync.get("userWebsites").then(result => {
      this.userWebsites = result["userWebsites"] || [];
      isDevMode() ? console.log("User Websites successfully fetched") : null;
    });
  }

  isWebsiteHasChangesPending(host: string): boolean {
    return this.pendingChangesService.isWebsitePending(host);
  }

  getOS(): string {
    if (window.navigator.userAgent.indexOf("Mac OS") != -1) {
      return "MacOS";
    } else if (window.navigator.userAgent.indexOf("Windows") != -1) {
      return "Windows";
    }
    return "Other";
  }
}
