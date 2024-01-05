import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { PopupComponent } from "./popup/popup.component";
import { OptionsComponent } from "./app-options/options-page/options.component";
import { AwarenessPageComponent } from "./app-overlay/awareness-page/awareness-page.component";

const routes: Routes = [
  { path: "popup", component: PopupComponent },
  { path: "options", component: OptionsComponent },
  { path: "options/:tab", component: OptionsComponent },
  { path: "blocked/:tabId/:outputURL", component: AwarenessPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
