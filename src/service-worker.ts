import { defaultConfig } from './defaultConfig.js';

chrome.webNavigation.onCommitted.addListener(function (details) {
  // Avoid showing blockpage if the request is made in background or isn't http/https
  if (details.frameId != 0 || !details.url.startsWith('http')) {
    return;
  }

  let commitedWebsite = new URL(details.url).host;
  if (commitedWebsite.substring(0, 4) == 'www.') {
    commitedWebsite = commitedWebsite.substring(4);
  }

  chrome.storage.local.get(['enforcedWebsites']).then((result) => {
    const enforcedWebsites = result['enforcedWebsites'];
    let websiteBlocked = enforcedWebsites.find((website: { host: string }) => {
      return website.host === commitedWebsite;
    });

    if (!websiteBlocked) {
      console.log('Website not blocked: ', commitedWebsite);
      return;
    }

    const allowedUntil: Date = new Date(websiteBlocked.allowedUntil);
    if (allowedUntil > new Date()) {
      console.log('Website is temporary allowed until: ', allowedUntil);
      return;
    }
    console.log(
      'Blocked! ',
      commitedWebsite,
      'tabID: ',
      details.tabId,
      ' url: ',
      details.url,
    );

    let redirectUrl = chrome.runtime.getURL(
      'index.html#blocked/' +
        encodeURIComponent(details.tabId) +
        '/' +
        encodeURIComponent(details.url),
    );
    chrome.tabs.update(details.tabId, { url: redirectUrl });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  defaultConfig();
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  console.log(tabid, ': tab closed');
});
