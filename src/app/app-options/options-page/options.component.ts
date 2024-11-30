import { Component, effect, isDevMode } from "@angular/core";
import { Location } from "@angular/common";
import { WebsitePaletteService } from "../services/website-palette/website-palette.service";
import { PendingChangesService } from "../services/pending-changes/pending-changes.service";
import { AwarenessPageComponent } from "../options-tabs/awareness-page/awareness-page.component";
import { WebsitesListComponent } from "../options-tabs/websites-list/websites-list.component";
import { DisconnectComponent } from "../options-tabs/disconnect/disconnect.component";
import { CommonModule } from "@angular/common";
import { WebsitesPaletteComponent } from "../components/websites-palette/websites-palette.component";
import { PendingChangesComponent } from "../components/pending-changes/pending-changes.component";
import { AboutComponent } from "../options-tabs/about/about.component";
import { ActivatedRoute } from "@angular/router";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { CompleteSetupComponent } from "../components/complete-setup/complete-setup.component";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [
    AwarenessPageComponent,
    WebsitesListComponent,
    DisconnectComponent,
    WebsitesPaletteComponent,
    PendingChangesComponent,
    CompleteSetupComponent,
    AboutComponent,
    CommonModule,
  ],
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"],
})
export class OptionsComponent {
  currentTab = "default-tab";
  isCommandPaletteShown = false;

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

    effect(() => {
      this.isCommandPaletteShown = this.commandPaletteService.isCommandPaletteShown();
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
