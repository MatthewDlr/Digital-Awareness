import { Component, NgZone, isDevMode } from "@angular/core";
import { CommandPaletteService } from "../services/command-palette/command-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { AwarenessPageTabComponent } from "../awareness-page-tab/awareness-page-tab.component";
import { HighlightedWebsitesTabComponent } from "../highlighted-websites-tab/highlighted-websites-tab.component";
import { NotificationsTabComponent } from "../notifications-tab/notifications-tab.component";
import { CommonModule } from "@angular/common";
import { WebsitesPaletteComponent } from "../components/websites-palette/websites-palette.component";
import { PendingChangesComponent } from "../components/pending-changes/pending-changes.component";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [AwarenessPageTabComponent, HighlightedWebsitesTabComponent, NotificationsTabComponent, WebsitesPaletteComponent, PendingChangesComponent, CommonModule],
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"],
})
export class OptionsComponent {
  currentTab: string = "blocklist";
  isCommandPaletteShown: boolean = false;

  constructor(
    public commandPaletteService: CommandPaletteService,
    public pendingChangesService: PendingChangesService,
    private ngZone: NgZone,
  ) {
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
