chrome.webNavigation.onCommitted.addListener(function (details, tabId) {
  if (details.frameId != 0 || !details.url.startsWith("https")) {
    return; // Avoid showing blockpage if the request is made in background or isn't https
  }

  let url = new URL(details.url).host;
  if (url.substring(0, 3) == "www") url = url.substring(4);

  chrome.storage.sync.get("blockedWebsites", function (result) {
    const blockedWebsites = result.blockedWebsites;
    let websiteBlocked = blockedWebsites.find((website) => {
      return website.host === url;
    });

    if (!websiteBlocked) {
      console.log("Website not blocked: ", url);
    }

    if (
      websiteBlocked.allowedUntil &&
      new Date(websiteBlocked.allowedUntil) > Date.now()
    ) {
      console.log(
        "Website is temporary allowed until: ",
        new Date(websiteBlocked.allowedUntil)
      );
      return;
    }

    console.log(
      "Blocked! ",
      url,
      "tabID: ",
      details.tabId,
      " url: ",
      details.url
    );
    let redirectUrl = chrome.runtime.getURL(
      "index.html#blocked/" +
        encodeURIComponent(details.tabId) +
        "/" +
        encodeURIComponent(details.url)
    );
    chrome.tabs.update(details.tabId, { url: redirectUrl });
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
      blockedWebsites: [
        {
          host: "youtube.com",
          allowedUntil: null,
          category: "Video",
        },
        {
          host: "shopping.google.com",
          allowedUntil: null,
          category: "Social",
        },
      ],
      timerValue: 30,
      allowedSites: [],
    })
    .then(() => {
      console.log("Default settings applied");
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
