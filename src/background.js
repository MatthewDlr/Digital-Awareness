chrome.webNavigation.onCommitted.addListener(function (details, tabId) {
  if (details.frameId != 0 || !details.url.startsWith("https")) {
    console.log("Frame ignored");
    return; // Avoid showing blockpage if the request is made in background
  }

  let url = new URL(details.url).host;
  if (url.substring(0, 3) == "www") url = url.substring(4);

  chrome.storage.sync.get("blocketWebsites", function (result) {
    const blocketWebsites = result.blocketWebsites;

    if (blocketWebsites.includes(url)) {
      console.log("Gotcha! ", url, "tabID: ", details.tabId);
      let redirectUrl = chrome.runtime.getURL(
        "index.html#blocked/" + btoa(details.tabId) + "/" + btoa(details.url)
      );
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  writeDefaultConfig();
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  console.log(tabid, ": tab closed");
});

function writeDefaultConfig() {
  chrome.storage.sync
    .set({
      blocketWebsites: [
        "x.com",
        "twitter.com",
        "youtube.com",
        "facebook.com",
        "instagram.com",
        "reddit.com",
        "tiktok.com",
        "netflix.com",
        "twitch.tv",
        "pinterest.com",
        "tumblr.com",
        "snapchat.com",
        "aliexpress.com",
        "alibaba.com",
        "wish.com",
        "etsy.com",
      ],
      timerValue: 30,
      allowedSites: [],
    })
    .then(() => {
      console.log("Default settings applied");
    });
  chrome.storage.local
    .set({
      allowedSites: [],
    })
    .then(() => {
      console.log("Allowed sites cleared");
    });
}

async function checkAllowedSites(url) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("allowedSites", function (result) {
      let allowedSites = result.allowedSites;
      console.log("Allowed sites: ", allowedSites);

      const allowedSite = allowedSites.find((host) => {
        return host.host === url;
      });
      if (allowedSite) {
        const allowedUntil = new Date(allowedSite.allowedUntil);
        const now = new Date();
        if (now.getTime() < allowedUntil.getTime()) {
          resolve(true);
        } else {
          allowedSites = allowedSites.filter((host) => {
            return host.host !== url;
          });
          chrome.storage.local.set({ allowedSites: allowedSites });
          console.log("Date is expired");
          resolve(false);
        }
      } else {
        console.log("No site found: " + url);
        resolve(false);
      }
    });
  });
}
