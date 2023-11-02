import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './options/options.component';
import { PopupComponent } from './popup/popup.component';
import { AppBlockingModule } from './app-blocking/app-blocking.module';

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    PopupComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule, AppBlockingModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
