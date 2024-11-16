import { BedtimeMode } from "./bedtimeMode.type";
import { RestrictedWebsite } from "./restrictedWebsite.type";

export interface UserConfig {
  extensionVersion: string;
  awarenessPageWidget: string;
  doomScrollingToggle: boolean;
  bedtimeMode: BedtimeMode;
  restrictedWebsites: Map<string, RestrictedWebsite>;
}
