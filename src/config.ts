import { UserConfig } from "./app/types/userConfig.type";

// Function use to write the default configuration just after the extension is installed
export function writeDefaultConfig() {
  const UserConfig: UserConfig = {
    extensionVersion: chrome.runtime.getManifest().version,
    awarenessPageWidget: "Quotes",
    doomScrollingToggle: true,
    restrictedWebsites: Object.fromEntries(new Map()),
    bedtimeMode: {
      isEnabled: true,
      startAt: {
        hours: 23,
        minutes: 0
      },
      endAt: {
        hours: 7,
        minutes: 0
      }
    },
  };

  chrome.storage.sync
    .set(UserConfig)
    .then(() => {
      console.info("Default configuration successfully written !");
    })
    .catch(error => {
      console.error("Failed to write the default configuration: " + error);
    });

  chrome.storage.local.set({ isSetupDismissed: false });
}
