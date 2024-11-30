import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import nightwind from "nightwind/helper";

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

nightwind.init();
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  nightwind.enable(true);
}
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  nightwind.toggle();
});
