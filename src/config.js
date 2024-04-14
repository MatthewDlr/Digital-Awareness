// Function use to write the default configuration just after the extension is installed
export function writeDefaultConfig() {
  chrome.storage.sync
    .set({
      isActivated: true, // Extension activation
      awarenessPageWidget: "Quotes", // Widget to display on the awareness page
      doomScrollingToggle: true, // Screen dimming when doom scrolling
      userWebsites: [], // Website the user will decide to block
      enforcedWebsites: [
        {
          host: "youtube.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Streaming",
        },
        {
          host: "netflix.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Streaming",
        },
        {
          host: "twitch.tv",
          allowedUntil: "",
          allowedAt: "",
          category: "Streaming",
        },
        {
          host: "primevideo.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Streaming",
        },
        {
          host: "disneyplus.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Streaming",
        },
        {
          host: "instagram.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "facebook.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "twitter.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "x.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "tiktok.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "snapchat.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "threads.net",
          allowedUntil: "",
          allowedAt: "",
          category: "Social",
        },
        {
          host: "aliexpress.com",
          allowedUntil: "",
          allowedAt: "",
          category: "Shopping",
        },
        {
          host: "temu.com",
          allowedUntil: "",
          allowedAt: "",
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
}

// Function use to update the configuration when a new version of the extension is installed
export async function updateConfig() {
  await chrome.storage.local.get(["update"]).then(result => {
    if (!result.update) {
      chrome.storage.sync.remove(["doomScrollingTreshold"]);
      chrome.storage.sync.remove(["doomScrollingNotification"]);
      chrome.storage.sync.remove(["bindWatchingNotification"]);
      chrome.storage.sync.set({ doomScrollingToggle: true });
      chrome.storage.local.set({ update: "1.1.0" });
    }

    if (!result.update || result.update === "1.1.0") {
      chrome.storage.sync.remove(["timerBehavior"]);
      chrome.storage.sync.get(["enforcedWebsites"]).then(result => {
        const savedWebsites = result["enforcedWebsites"];
        for (let website of savedWebsites) {
          delete website.timer;
          delete website.timesBlocked;
          delete website.timesAllowed;
          website.allowedAt = "";
        }
        chrome.storage.sync.set({ enforcedWebsites: savedWebsites });
      });
      chrome.storage.sync.get(["userWebsites"]).then(result => {
        const savedWebsites = result["userWebsites"];
        for (let website of savedWebsites) {
          delete website.timer;
          delete website.timesBlocked;
          delete website.timesAllowed;
          website.allowedAt = "";
        }
        chrome.storage.sync.set({ userWebsites: savedWebsites });
      });
      chrome.storage.local.set({ update: "1.2.0" });
      console.info("Updated to 1.2.0");

      return;
    }
  });
}
