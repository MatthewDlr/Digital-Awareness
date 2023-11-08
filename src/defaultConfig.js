export function defaultConfig() {
  chrome.storage.local
    .set({
      enforcedWebsites: [
        {
          host: "youtube.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          host: "netflix.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          host: "twitch.tv",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          host: "primevideo.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          host: "disneyplus.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
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
          host: "aliexpress.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
      ],
    })
    .then(() => {
      console.log("enforcedWebsites set");
    });

  chrome.storage.sync
    .set({
      timerValue: 30, // Timer base value is 30 sec
      timeAllowed: 30, // When a website is allowed, the default duration is 30 min
      userWebsites: [
        {
          host: "edition.cnn.com",
          allowedUntil: "next time",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },
      ], // Website the user will decide to block
      userCategories: [] // Categories the user will decide to block
    })
    .then(() => {
      console.log("sync set");
    });
}
