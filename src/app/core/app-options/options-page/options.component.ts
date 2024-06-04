import { Component, isDevMode } from "@angular/core";
import { Location } from "@angular/common";
import { WebsitePaletteService } from "../websites-palette/services/website-palette/website-palette.service";
import { PendingChangesService } from "../pending-changes/services/pending-changes/pending-changes.service";
import { AwarenessTabComponent } from "../options-tabs/awareness-tab/awareness-tab.component";
import { WebsitesTabComponent } from "../options-tabs/websites-list/websites-tab/websites-tab.component";
import { DisconnectTabComponent } from "../options-tabs/disconnect/disconnect-tab/disconnect-tab.component";
import { CommonModule } from "@angular/common";
import { WebsitesPaletteComponent } from "../websites-palette/components/website-palette/websites-palette.component";
import { PendingChangesComponent } from "../pending-changes/components/pending-changes/pending-changes.component";
import { AboutTabComponent } from "../options-tabs/about-tab/about-tab.component";
import { ActivatedRoute } from "@angular/router";
import { SoundsEngineService } from "app/core/shared/services/soundsEngine/sounds-engine.service";
import { CompleteSetupComponent } from "../complete-setup/complete-setup.component";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [
    AwarenessTabComponent,
    WebsitesTabComponent,
    DisconnectTabComponent,
    WebsitesPaletteComponent,
    PendingChangesComponent,
    CompleteSetupComponent,
    AboutTabComponent,
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
    public commandPaletteService: WebsitePaletteService,
    public pendingChangesService: PendingChangesService,
  ) {
    this.route.params.subscribe(params => {
      this.currentTab = params["tab"] ? params["tab"] : "default-tab";
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
