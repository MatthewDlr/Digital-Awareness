import { Component, isDevMode } from "@angular/core";
import { CommandPaletteService } from "../services/command-palette/command-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { AwarenessPageOptionComponent } from "../awareness-page-option/awareness-page-option.component";
import { HighlightedWebsitesOptionComponent } from "../highlighted-websites-option/highlighted-websites-option.component";
import { NotificationsOptionComponent } from "../notifications-option/notifications-option.component";
import { CommonModule } from "@angular/common";
import { WebsitesPaletteComponent } from "../components/websites-palette/websites-palette.component";
import { PendingChangesComponent } from "../components/pending-changes/pending-changes.component";
import { AboutComponent } from "../about/about.component";
import { ActivatedRoute } from "@angular/router";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [
    AwarenessPageOptionComponent,
    HighlightedWebsitesOptionComponent,
    NotificationsOptionComponent,
    WebsitesPaletteComponent,
    PendingChangesComponent,
    AboutComponent,
    CommonModule,
  ],
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"],
})
export class OptionsComponent {
  currentTab!: string;
  isCommandPaletteShown: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private soundsEngine: SoundsEngineService,
    public commandPaletteService: CommandPaletteService,
    public pendingChangesService: PendingChangesService,
  ) {
    this.route.params.subscribe(params => {
      const tab = params["tab"] || "blocklist";
      switch (tab) {
        case "blocklist":
          this.currentTab = "blocklist";
          break;
        case "highlighted":
          this.currentTab = "highlighted";
          break;
        case "notifications":
          this.currentTab = "notifications";
          break;
        case "about":
          this.currentTab = "about";
          break;
        default:
          this.currentTab = "blocklist";
      }
    });

    this.commandPaletteService.isCommandPaletteShown.subscribe({
      next: state => {
        this.isCommandPaletteShown = state;
      },
    });
  }

  setCurrentTab(tab: string) {
    this.soundsEngine.selectHard();
    this.currentTab = tab;
  }

  isDevModeEnabled() {
    return isDevMode();
  }
}
