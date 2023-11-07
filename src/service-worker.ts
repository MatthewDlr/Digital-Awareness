import { defaultConfig } from "./defaultConfig.js"

chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.frameId != 0 || !details.url.startsWith("https")) {
    return; // Avoid showing blockpage if the request is made in background or isn't https
  }

  let url = new URL(details.url).host;
  if (url.substring(0, 3) == "www") url = url.substring(4);

  chrome.storage.sync.get("mandatoryWebsites", function (result) {
    const blockedWebsites = result['mandatoryWebsites'];
    let websiteBlocked = blockedWebsites.find((website: { url: string; }) => {
      return website.url === url;
    });

    if (!websiteBlocked) {
      console.log("Website not blocked: ", url);
      return;
    }

    if (
      websiteBlocked.allowedUntil &&
      new Date(websiteBlocked.allowedUntil).getTime() > Date.now()
    ) {
      console.log(
        "Website is temporary allowed until: ",
        new Date(websiteBlocked.allowedUntil),
      );
      return;
    }

    console.log(
      "Blocked! ",
      url,
      "tabID: ",
      details.tabId,
      " url: ",
      details.url,
    );
    let redirectUrl = chrome.runtime.getURL(
      "index.html#blocked/" +
        encodeURIComponent(details.tabId) +
        "/" +
        encodeURIComponent(details.url),
    );
    chrome.tabs.update(details.tabId, { url: redirectUrl });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  defaultConfig();
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  console.log(tabid, ": tab closed");
});

