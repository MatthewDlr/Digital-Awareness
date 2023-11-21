import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwarenessPageComponent } from './awareness-page/awareness-page.component';
import { AllowedSitesService } from './services/allowed-sites/allowed-sites.service';
import { Quotes } from './services/quotes';
import { DoomScrollingPageComponent } from './doom-scrolling-page/doom-scrolling-page.component';

@NgModule({
  declarations: [AwarenessPageComponent, DoomScrollingPageComponent],
  imports: [CommonModule],
  providers: [AllowedSitesService, Quotes],
})
export class AppPagesModule {}
