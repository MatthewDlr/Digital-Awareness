// Function use to write the default configuration just after the extension is installed
export function writeDefaultConfig() {
  chrome.storage.sync
    .set({
      isActivated: true, // Extension activation
      awarenessPageWidget: "Quotes", // Widget to display on the awareness page
      doomScrollingToggle: true, // Screen dimming when doom scrolling
      userWebsites: [], // Website the user will decide to block
    })
    .then(() => {
      console.info("Default configuration successfully written !");
    })
    .catch(error => {
      console.error("Failed to write the default configuration: " + error);
    });

  chrome.storage.local.set({ isSetupDismissed: false });
}

// Function use to update the configuration when a new version of the extension is installed
export async function updateConfig() {
  await chrome.storage.local.get(["update"]).then(result => {});
}
