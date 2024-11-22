import { BedtimeMode } from "./bedtimeMode.type";
import { RestrictedWebsite } from "./restrictedWebsite.type";

export interface UserConfig {
  extensionVersion: string;
  isSetupDismissed: boolean;
  restrictedWebsites: Map<string, RestrictedWebsite>;
  awarenessPageWidget: string;
  awarenessPageTasks: string[];
  doomScrollingToggle: boolean;
  bedtimeMode: BedtimeMode;
}
