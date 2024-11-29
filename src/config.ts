import { UserConfig } from "./app/types/userConfig.type";
import { setConfig } from "app/shared/chrome-storage-api";

// Function use to write the default configuration just after the extension is installed
export function writeDefaultConfig() {
  const UserConfig: UserConfig = {
    extensionVersion: chrome.runtime.getManifest().version,
    isSetupDismissed: false,
    restrictedWebsites: Object.fromEntries(new Map()),
    awarenessPageWidget: "Quotes",
    awarenessPageTasks: ["", "", ""],
    doomScrollingToggle: true,
    bedtimeMode: {
      isEnabled: true,
      startAt: {
        hours: 23,
        minutes: 0,
      },
      endAt: {
        hours: 7,
        minutes: 0,
      },
    },
  };
  setConfig(UserConfig);
}
