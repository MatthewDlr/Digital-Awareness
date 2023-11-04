import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './options-page/options.component';
import { BlocklistTabComponent } from './blocklist-tab/blocklist-tab.component';
import { BlockpageTabComponent } from './blockpage-tab/blockpage-tab.component';
import { NotificationsTabComponent } from './notifications-tab/notifications-tab.component';

@NgModule({
  declarations: [
    OptionsComponent,
    BlocklistTabComponent,
    BlockpageTabComponent,
    NotificationsTabComponent,
  ],
  imports: [CommonModule],
})
export class OptionsModule {}
