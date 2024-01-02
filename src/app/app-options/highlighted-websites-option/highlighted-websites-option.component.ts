import { Component, HostListener, ViewChild } from "@angular/core";
import { watchedWebsite } from "src/app/types";
import { CommandPaletteService } from "../services/command-palette/command-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { WebsitesService } from "src/app/app-overlay/services/websites/websites.service";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";


@Component({
  selector: "app-highlighted-websites-option",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./highlighted-websites-option.component.html",
  styleUrls: ["./highlighted-websites-option.component.css"],
})
export class HighlightedWebsitesOptionComponent {
  enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];
  isCommandPaletteShown: boolean = false;
  OS: string = this.getOS();

  editIndex: number = -1;
  oldHost!: string;

  constructor(
    private soundsEngine: SoundsEngineService,
    private commandPaletteService: CommandPaletteService,
    private pendingChangesService: PendingChangesService,
    private websitesService: WebsitesService,
  ) {
    this.getWebsites();
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

  @HostListener("document:keydown.enter", ["$event"])
  onEnterHandler() {
    if (this.editIndex === -1) {
      return;
    }
    this.editWebsite(this.userWebsites[this.editIndex]);
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
    this.soundsEngine.pop();
  }

  computeBlockedScore(website: watchedWebsite): number {
    return this.websitesService.computeWebsiteScore(website);
  }

  getWebsites() {
    Promise.all([chrome.storage.local.get("enforcedWebsites"), chrome.storage.sync.get("userWebsites")]).then(
      ([enforcedResult, userResult]) => {
        this.enforcedWebsites = enforcedResult["enforcedWebsites"] || [];
        this.userWebsites = userResult["userWebsites"] || [];
      },
    );
  }

  @ViewChild("hostInput") input!: { nativeElement: HTMLInputElement };
  enableEdit(index: number, websiteToEdit: watchedWebsite) {
    this.soundsEngine.pop();
    this.editIndex = index;
    this.oldHost = websiteToEdit.host;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 0);
  }

  editWebsite(websiteToEdit: watchedWebsite) {
    websiteToEdit.host = websiteToEdit.host.trim();
    if (this.editIndex === -1 || websiteToEdit.host === "") {
      return;
    }

    this.editIndex = -1;
    if (this.oldHost !== websiteToEdit.host) {
      this.pendingChangesService.addWebsiteToEdit(this.oldHost, websiteToEdit.host);
    }
  }

  removeWebsite(websiteToDelete: watchedWebsite) {
    this.soundsEngine.erase();
    this.userWebsites = this.userWebsites.filter(website => website.host !== websiteToDelete.host);
    this.pendingChangesService.addWebsiteToRemove(websiteToDelete.host);
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
