import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { PopupComponent } from "./popup/popup.component";

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
