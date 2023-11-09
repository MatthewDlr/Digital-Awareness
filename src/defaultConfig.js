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
      categoriesWebsites: [],
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
          category: "News",
        },
      ], // Website the user will decide to block
      userCategories: [
        {
          name: 'News',
          isActive: false
        },
        {
          name: 'Social',
          isActive: false
        },
        {
          name: 'Shopping',
          isActive: false
        },
        {
          name: 'Sreaming',
          isActive: false
        },
        {
          name: 'Adult',
          isActive: false
        },
        {
          name: 'Gambling',
          isActive: false
        }
      ]
    })
    .then(() => {
      console.log("sync set");
    });
}
