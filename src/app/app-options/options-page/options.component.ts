import { Component, isDevMode } from "@angular/core";
import { Location } from "@angular/common";
import { CommandPaletteService } from "../services/command-palette/command-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { AwarenessPageComponent } from "../options-tabs/awareness-page/awareness-page.component";
import { WebsitesListComponent } from "../options-tabs/websites-list/websites-list.component";
import { NotificationsComponent } from "../options-tabs/notifications/notifications.component";
import { CommonModule } from "@angular/common";
import { WebsitesPaletteComponent } from "../components/websites-palette/websites-palette.component";
import { PendingChangesComponent } from "../components/pending-changes/pending-changes.component";
import { AboutComponent } from "../options-tabs/about/about.component";
import { ActivatedRoute } from "@angular/router";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [
    AwarenessPageComponent,
    WebsitesListComponent,
    NotificationsComponent,
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
    private location: Location,
    private soundsEngine: SoundsEngineService,
    public commandPaletteService: CommandPaletteService,
    public pendingChangesService: PendingChangesService,
  ) {
    this.route.params.subscribe(params => {
      this.currentTab = params["tab"] ? params["tab"] : "blocklist";
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
    this.location.replaceState("/options/" + tab);
  }

  isDevModeEnabled() {
    return isDevMode();
  }
}
