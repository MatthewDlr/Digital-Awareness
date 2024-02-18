import { importProvidersFrom } from "@angular/core";
import { AppComponent } from "./app/app.component";
import { AppRoutingModule } from "./app/app-routing.module";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { LocationStrategy, HashLocationStrategy, CommonModule } from "@angular/common";

// @ts-expect-error
import nightwind from "nightwind/helper";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, CommonModule),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
}).catch(err => console.error(err));

nightwind.initNightwind();
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  nightwind.toggle();
});
