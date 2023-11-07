export function defaultConfig() {
  chrome.storage.local
    .set({
      enforcedWebsites: [
        {
          url: "youtube.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          url: "netflix.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          url: "twitch.tv",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          url: "primevideo.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          url: "disneyplus.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Sreaming",
        },
        {
          url: "instagram.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "facebook.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "twitter.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "x.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "reddit.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "tiktok.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "snapchat.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "threads.net",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Social",
        },
        {
          url: "aliexpress.com",
          allowedUntil: "",
          timesBlocked: 0,
          timesAllowed: 0,
          category: "Shopping",
        },

      ],
    })
    .then(console.log("defaultConfigWritten"));
}
