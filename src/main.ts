import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
// @ts-expect-error
import nightwind from "nightwind/helper";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

nightwind.initNightwind();

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  nightwind.toggle();
});
