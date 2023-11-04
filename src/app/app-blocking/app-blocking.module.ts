import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockPageComponent } from './blockpage/blockpage.component';
import { AllowedSitesService } from './services/allowed-sites/allowed-sites.service';
import { Quotes } from './services/quotes';

@NgModule({
  declarations: [BlockPageComponent],
  imports: [CommonModule],
  providers: [AllowedSitesService, Quotes],
})
export class AppBlockingModule {}
