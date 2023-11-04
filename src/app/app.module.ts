import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { AppBlockingModule } from './app-blocking/app-blocking.module';
import { OptionsModule } from './app-options/options.module';
import { NotificationsTabComponent } from './app-options/notifications-tab/notifications-tab.component'; 

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    NotificationsTabComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule, AppBlockingModule, OptionsModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
