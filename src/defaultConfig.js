export function defaultConfig() {
  chrome.storage.local
    .set({
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
          host: "music.youtube.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Music",
        },
        {
          host: "spotify.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Music",
        },
        {
          host: "aliexpress.com",
          allowedUntil: "",
          timer: 30,
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
      ],
      categoriesWebsites: [],
    })
    .then(() => {
      console.info("enforcedWebsites set");
    });

  chrome.storage.sync
    .set({
      timeAllowed: 30, // Default time allowed (in minutes)
      awarenessPageWidget: "Quotes", // Widget to display on the awareness page
      timerBehavior: "Pause", // What to do when the awareness page is not focused
      doomScrollingNotification: true, // Notification when doom scrolling
      doomScrollingTreshold: 100, // Number of time the user can scroll before notification
      bindWatchingNotification: true, // Notification when bind watching
      userWebsites: [], // Website the user will decide to block
      userCategories: [
        {
          name: "News",
          isActive: false,
        },
        {
          name: "Social",
          isActive: false,
        },
        {
          name: "Shopping",
          isActive: false,
        },
        {
          name: "Streaming",
          isActive: false,
        },
        {
          name: "Adult",
          isActive: false,
        },
        {
          name: "Gambling",
          isActive: false,
        },
      ],
    })
    .then(() => {
      console.info("sync set");
    });
}
