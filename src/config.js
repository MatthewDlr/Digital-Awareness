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
  // chrome.storage.local.set({ bingeWatchingSupportedWebsites: ["youtube"] });
}

// Function use to update the configuration when a new version of the extension is installed
export async function updateConfig() {
  await chrome.storage.local.get(["update"]).then(result => {
    if (!result.update || result.update === "1.1.0") {
      chrome.storage.sync.remove(["timerBehavior"]);
      chrome.storage.local.get(["enforcedWebsites"]).then(result => {
        const savedWebsite = result[enforcedWebsites];
        for (let website of savedWebsite) {
          website.remove(timer);
          website.remove(timesBlocked);
          website.remove(timesAllowed);
          website.allowedAt = [];
        }
        chrome.storage.local.set({ enforcedWebsites: savedWebsite });
      });
      chrome.storage.sync.get("userWebsites").then(websites => {
        const savedWebsite = websites;
        console.log(savedWebsite);
        if (savedWebsite.length < 1) return;
        for (let website of savedWebsite) {
          website.remove(timer);
          website.remove(timesBlocked);
          website.remove(timesAllowed);
          website.allowedAt = [];
        }
        chrome.storage.local.set({ userWebsites: savedWebsite });
      });
      console.info("Updated to V2");
      chrome.storage.local.set({ update: "2.0.0" });

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
