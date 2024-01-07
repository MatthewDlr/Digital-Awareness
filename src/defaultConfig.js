export function defaultConfig() {
  chrome.storage.sync
    .set({
      isActivated: true, // Extension activation
      awarenessPageWidget: "Quotes", // Widget to display on the awareness page
      timerBehavior: "Restart", // What to do when the awareness page is not focused
      doomScrollingNotification: true, // Notification when doom scrolling
      doomScrollingTreshold: 125, // Number of time the user can scroll before notification
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
}
