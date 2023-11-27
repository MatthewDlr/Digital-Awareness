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
    // Check if the website blocked by the list of mandatory blocked websites
    const enforcedWebsites = result['enforcedWebsites'];
    const isEnforced = isWebsiteBlocked(commitedWebsite, enforcedWebsites);

    if (isEnforced) {
      redirectToWaitPage(details);
    } else {
      // Check if the website is in the list of user blocked websites
      chrome.storage.sync.get(['userWebsites']).then((result) => {
        const userWebsites = result['userWebsites'];
        const isBlocked = isWebsiteBlocked(commitedWebsite, userWebsites);

        if (isBlocked) {
          redirectToWaitPage(details);
        }
      });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  defaultConfig();
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  console.log(tabid, ': tab closed');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == 'doomScrolling') {
    chrome.storage.sync.get('doomScrollingNotification', (result) => {
      if (result['doomScrollingNotification'] == true) {
        chrome.notifications.create('doomScrollingNotification', {
          type: 'basic',
          iconUrl: '/assets/logo128.png',
          title: 'Doom Scrolling Detected',
          message:
            "Seems that you've been scrolling for a while, let's take a break!",
          priority: 2,
          buttons: [
            {
              title: 'incorrect detection?',
            },
          ],
        });
        chrome.notifications.onButtonClicked.addListener(
          function (notificationId, buttonIndex) {
            if (notificationId === 'doomScrollingNotification') {
              chrome.storage.sync.get('doomScrollingTreshold', (result) => {
                chrome.storage.sync.set({
                  doomScrollingTreshold: result['doomScrollingTreshold'] + 5,
                });
              });
              chrome.notifications.clear(notificationId);
            }
          },
        );
      }
    });
  }
});

function isWebsiteBlocked(
  commitedHost: string,
  blockedWebsites: any[],
): boolean {
  let blockedWebsite = blockedWebsites.find((website) => {
    return website.host === commitedHost;
  });

  if (!blockedWebsite) {
    console.log('Website not blocked: ', commitedHost);
    return false;
  }

  const allowedUntil: Date = new Date(blockedWebsite.allowedUntil);
  if (allowedUntil > new Date()) {
    console.log('Website is temporary allowed until: ', allowedUntil);
    return false;
  }

  console.log('Website blocked: ', commitedHost);
  return true;
}

function redirectToWaitPage(details: any) {
  let redirectUrl = chrome.runtime.getURL(
    'index.html#blocked/' +
      encodeURIComponent(details.tabId) +
      '/' +
      encodeURIComponent(details.url),
  );
  chrome.tabs.update(details.tabId, { url: redirectUrl });
}
