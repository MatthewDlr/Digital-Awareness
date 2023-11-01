chrome.webNavigation.onCompleted.addListener(function (details) {
  if (details.frameId != 0) {
    return;
  }

  let host = new URL(details.url).host;
  if (host.substring(0, 3) == "www") host = host.substring(4);

  chrome.storage.sync.get("blocketWebsites", function (result) {
    let blocketWebsites = result.blocketWebsites;

    if (blocketWebsites.includes(host)) {
      console.log("Gotcha! ", host);
      let redirectUrl = chrome.runtime.getURL("index.html#blocked");
      chrome.tabs.update(details.tabId, { url: redirectUrl });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  writeDefaultConfig();
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
      "timerValue" : 30,
    })
    .then(() => {
      console.log("Default settings applied");
    });
}
