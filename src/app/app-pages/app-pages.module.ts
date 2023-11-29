import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AwarenessPageComponent } from "./awareness-page/awareness-page.component";
import { AllowedSitesService } from "./services/allowed-sites/allowed-sites.service";
import { Quotes } from "./services/quotes";

@NgModule({
  declarations: [AwarenessPageComponent],
  imports: [CommonModule],
  providers: [AllowedSitesService, Quotes],
})
export class AppPagesModule {}
