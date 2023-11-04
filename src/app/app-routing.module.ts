import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { PopupComponent } from './popup/popup.component';
import { OptionsComponent } from './app-options/options-page/options.component';
import { BlockPageComponent } from './app-blocking/blockpage/blockpage.component'

const routes: Routes = [
  { path: 'popup', component: PopupComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'blocked/:tabId/:outputURL', component: BlockPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
