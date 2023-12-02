export function defaultConfig() {
  chrome.storage.local
    .set({
      enforcedWebsites: [
        {
          host: "youtube.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "netflix.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "twitch.tv",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "primevideo.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "disneyplus.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Streaming",
        },
        {
          host: "instagram.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "facebook.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "twitter.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "x.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "tiktok.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "snapchat.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "threads.net",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          host: "music.youtube.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Music",
        },
        {
          host: "spotify.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Music",
        },
        {
          host: "aliexpress.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
      ],
      categoriesWebsites: [],
    })
    .then(() => {
      console.log("enforcedWebsites set");
    });

  chrome.storage.sync
    .set({
      timerValue: 30, // Default timer value (in seconds)
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
          isActive: false
        },
        {
          name: "Social",
          isActive: false
        },
        {
          name: "Shopping",
          isActive: false
        },
        {
          name: "Streaming",
          isActive: false
        },
        {
          name: "Adult",
          isActive: false
        },
        {
          name: "Gambling",
          isActive: false
        }
      ]
    })
    .then(() => {
      console.log("sync set");
    });
}
