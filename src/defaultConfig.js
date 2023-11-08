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
      timerValue: 0,
      timeAllowed: 30,
    })
    .then(() => {
      console.log("sync set");
    });
}
