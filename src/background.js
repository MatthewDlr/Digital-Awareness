chrome.webNavigation.onCommitted.addListener(function (details, tabId) {
  if (details.frameId != 0) {
    return; // Avoid showing blockpage if the request is made in background
  }

  let host = new URL(details.url).host;
  if (host.substring(0, 3) == "www") host = host.substring(4);

  chrome.storage.sync.get("blocketWebsites", function (result) {
    let blocketWebsites = result.blocketWebsites;

    if (blocketWebsites.includes(host)) {
      console.log("Gotcha! ", host, "tabID: ", details.tabId);
      let redirectUrl = chrome.runtime.getURL("index.html#blocked/" + btoa(details.tabId) + "/" + btoa(details.url));
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
    })
    .then(() => {
      console.log("Default settings applied");
    });
}
