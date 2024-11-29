import { Component, effect, HostListener } from "@angular/core";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";
import { WebsitePaletteService } from "../../services/website-palette/website-palette.service";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { WebsitesListRowComponent } from "../../components/websites-list-row/websites-list-row.component";
import { getRestrictedWebsites } from "app/shared/chrome-storage-api";

@Component({
    selector: "app-websites-list",
    imports: [CommonModule, FormsModule, WebsitesListRowComponent],
    templateUrl: "./websites-list.component.html",
    styleUrls: ["./websites-list.component.css"]
})
export class WebsitesListComponent {
  restrictedWebsites = new Map<string, RestrictedWebsite>();
  websitesPendingEdit = new Set<string>();
  isCommandPaletteShown = false;
  OS: string = this.getOS();

  constructor(
    private soundsEngine: SoundsEngineService,
    private commandPaletteService: WebsitePaletteService,
    public pendingChangesService: PendingChangesService,
  ) {
    effect(() => {
      this.isCommandPaletteShown = this.commandPaletteService.isCommandPaletteShown();
      if (!this.isCommandPaletteShown) {
        setTimeout(() => {
          this.getWebsites();
          this.getWebsitesPendingEdit();
        }, 100);
      }
    });
    this.pendingChangesService.stage.subscribe({
      next: () => {
        this.getWebsites();
        this.getWebsitesPendingEdit();
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
    this.soundsEngine.selectHard();
  }

  private async getWebsites() {
    this.restrictedWebsites = await getRestrictedWebsites();
    console.log(this.restrictedWebsites);
  }

  getWebsitesPendingEdit() {
    this.websitesPendingEdit.clear();
    this.pendingChangesService.websitesToEdit.forEach(website => {
      this.websitesPendingEdit.add(website.oldHost);
    });
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
