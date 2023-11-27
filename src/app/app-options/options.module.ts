import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionsComponent } from './options-page/options.component';
import { HighlightedWebsitesTabComponent } from './highlighted-websites-tab/highlighted-websites-tab.component';
import { AwarenessPageTabComponent } from './awareness-page-tab/awareness-page-tab.component';
import { NotificationsTabComponent } from './notifications-tab/notifications-tab.component';
import { WebsitesPaletteComponent } from './components/websites-palette/websites-palette.component';
import { CommandPaletteService } from './services/command-palette/command-palette.service';
import { PendingChangesComponent } from './components/pending-changes/pending-changes.component';
import { PendingChangesService } from './services/pending-changes/pending-changes.service';

@NgModule({
  declarations: [
    OptionsComponent,
    HighlightedWebsitesTabComponent,
    AwarenessPageTabComponent,
    NotificationsTabComponent,
    WebsitesPaletteComponent,
    PendingChangesComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [CommandPaletteService, PendingChangesService]
})
export class OptionsModule {}
