import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionsComponent } from './options-page/options.component';
import { BlocklistTabComponent } from './blocklist-tab/blocklist-tab.component';
import { BlockpageTabComponent } from './blockpage-tab/blockpage-tab.component';
import { NotificationsTabComponent } from './notifications-tab/notifications-tab.component';
import { CommandPaletteComponent } from './options-components/command-palette/command-palette.component';
import { CommandPaletteService } from './services/command-palette/command-palette.service';

@NgModule({
  declarations: [
    OptionsComponent,
    BlocklistTabComponent,
    BlockpageTabComponent,
    NotificationsTabComponent,
    CommandPaletteComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [CommandPaletteService]
})
export class OptionsModule {}
