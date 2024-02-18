// Function use to write the default configuration just after the extension is installed
export function writeDefaultConfig() {
  chrome.storage.sync
    .set({
      isActivated: true, // Extension activation
      awarenessPageWidget: "Quotes", // Widget to display on the awareness page
      timerBehavior: "Restart", // What to do when the awareness page is not focused
      doomScrollingToggle: true, // Screen dimming when doom scrolling
      // bingeWatchingToggle: true, // Alert when binge watching on supported websites
      userWebsites: [], // Website the user will decide to block
      enforcedWebsites: [
        {
          host: "youtube.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "netflix.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "twitch.tv",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "primevideo.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "disneyplus.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "instagram.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "facebook.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "twitter.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "x.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "tiktok.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "snapchat.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "threads.net",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "aliexpress.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
        {
          host: "temu.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
      ],
    })
    .then(() => {
      console.info("Default configuration successfully written !");
    })
    .catch(error => {
      console.error("Failed to write the default configuration: " + error);
    });

  chrome.storage.local.set({ isSetupDismissed: false });
  // chrome.storage.local.set({ bingeWatchingSupportedWebsites: ["youtube"] });
}

// Function use to update the configuration when a new version of the extension is installed
export async function updateConfig() {
  await chrome.storage.local.get(["update"]).then(result => {
    if (result.update === "1.1.0") {
      console.info("Configuration already updated !");
      return;
    }
  });

  chrome.storage.sync.remove(["doomScrollingTreshold"]);
  chrome.storage.sync.remove(["doomScrollingNotification"]);
  chrome.storage.sync.remove(["bindWatchingNotification"]);
  chrome.storage.sync.set({ doomScrollingToggle: true });
  chrome.storage.local.set({ update: "1.1.0" });

  console.info("Configuration successfully updated !");
}
