import { defaultConfig } from "./defaultConfig.js";
import { isDevMode } from "@angular/core";

chrome.webNavigation.onCommitted.addListener(function (details) {
  // Avoid showing blockpage if the request is made in background or isn't http/https
  if (details.frameId != 0 || !details.url.startsWith("http")) return;

  let commitedWebsite = new URL(details.url).host;
  if (commitedWebsite.substring(0, 4) == "www.") commitedWebsite = commitedWebsite.substring(4);

  chrome.storage.sync.get(["enforcedWebsites"]).then(result => {
    // Check if the website blocked by the list of mandatory blocked websites
    const enforcedWebsites = result["enforcedWebsites"];
    const isEnforced = isWebsiteBlocked(commitedWebsite, enforcedWebsites);

    if (isEnforced) {
      redirectToWaitPage(details);
    } else {
      // Check if the website is in the list of user blocked websites
      chrome.storage.sync.get(["userWebsites"]).then(result => {
        const userWebsites = result["userWebsites"];
        const isBlocked = isWebsiteBlocked(commitedWebsite, userWebsites);

        if (isBlocked) {
          redirectToWaitPage(details);
        }
      });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["isUpdating"]).then(result => {
    const isUpdating = result["isUpdating"] || false;
    isDevMode() ? console.log("isUpdating: " + isUpdating) : null;
    if (isUpdating) {
      chrome.storage.local.set({ isUpdating: false });
      chrome.action.setBadgeText({ text: "" });
      chrome.tabs.create({ url: chrome.runtime.getURL("index.html#options/about") });
    } else {
      chrome.storage.sync.get(["isActivated"]).then(result => {
        const isActivated = result["isActivated"] || false;
        console.log("isActivated: " + isActivated);
        if (!isActivated) {
          defaultConfig();
          chrome.tabs.create({ url: chrome.runtime.getURL("index.html#options/about") });
        }
      });
    }
  });
});

chrome.runtime.onUpdateAvailable.addListener(function (details) {
  chrome.action.setBadgeText({ text: "New" });
  chrome.action.setBadgeTextColor({ color: "#fff" });
  chrome.action.setBadgeBackgroundColor({ color: "#7c3aed" });
  console.log("Digital Araweness is ready to be updated (v" + details.version + ")");
});

chrome.action.onClicked.addListener(function () {
  chrome.runtime.requestUpdateCheck(function (statut) {
    if (statut == "update_available") {
      chrome.storage.local.set({ isUpdating: true });
      chrome.runtime.reload();
    }
  });
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type == "doomScrolling") {
    chrome.storage.sync.get("doomScrollingNotification", result => {
      if (result["doomScrollingNotification"] == true) {
        chrome.notifications.create("doomScrollingNotification", {
          type: "basic",
          iconUrl: "/assets/logo-512.png",
          title: "Doom Scrolling Detected",
          message: "Seems that you've been scrolling for a while, let's take a break!",
          priority: 2,
          buttons: [
            {
              title: "incorrect detection?",
            },
          ],
        });
        chrome.notifications.onButtonClicked.addListener(function (notificationId) {
          if (notificationId === "doomScrollingNotification") {
            chrome.storage.sync.get("doomScrollingTreshold", result => {
              chrome.storage.sync.set({
                doomScrollingTreshold: result["doomScrollingTreshold"] + 5,
              });
            });
            chrome.notifications.clear(notificationId);
          }
        });
      }
    });
  }
});

chrome.runtime.onSuspend.addListener(function () {
  chrome.storage.local.set({ isUpdating: true });
});

function isWebsiteBlocked(commitedHost: string, blockedWebsites: any[]): boolean {
  const blockedWebsite = blockedWebsites.find(website => {
    return website.host === commitedHost;
  });

  if (!blockedWebsite) {
    isDevMode() ? console.log("Website not blocked: ", commitedHost) : null;
    return false;
  }

  const allowedUntil: Date = new Date(blockedWebsite.allowedUntil);
  if (allowedUntil > new Date()) {
    console.log("Website is temporary allowed until: ", allowedUntil);
    return false;
  }

  isDevMode() ? console.log("Website blocked: ", commitedHost) : null;
  return true;
}

function redirectToWaitPage(details: any) {
  const redirectUrl = chrome.runtime.getURL(
    "index.html#blocked/" + encodeURIComponent(details.tabId) + "/" + encodeURIComponent(details.url),
  );
  chrome.tabs.update(details.tabId, { url: redirectUrl });
}
