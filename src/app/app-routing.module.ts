import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { PopupComponent } from './popup/popup.component';
import { OptionsComponent } from './options/options.component';
import { BlockPageComponent } from './blockpage/blockpage.component'

const routes: Routes = [
  { path: 'popup', component: PopupComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'blocked', component: BlockPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
