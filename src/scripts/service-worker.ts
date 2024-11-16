import { writeDefaultConfig } from "../config";
import { isDevMode } from "@angular/core";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";
const fullConfig = resolveConfig(tailwindConfig);
import dayjs, { Dayjs } from "dayjs";
import { getRestrictedWebsites } from "app/shared/chrome-storage-api";

chrome.webNavigation.onCommitted.addListener(async function (details) {
  // Avoid showing block page if the request is made in background or isn't http/https
  if (details.frameId != 0 || !details.url.startsWith("http")) return;

  let navigatedWebsiteHost = new URL(details.url).host;
  if (navigatedWebsiteHost.substring(0, 4) == "www.")
    navigatedWebsiteHost = navigatedWebsiteHost.substring(4);

  const restrictedWebsites = await getRestrictedWebsites();
  const restrictedWebsite = restrictedWebsites.get(navigatedWebsiteHost);

  if (!restrictedWebsite) {
    isDevMode() && console.log("Website not blocked: ", restrictedWebsite);
    return;
  }

  const allowedUntil: Dayjs = dayjs(restrictedWebsite.allowedUntil);
  if (allowedUntil > dayjs()) {
    isDevMode() && console.log("Website temporary allowed until:", allowedUntil.toString());
    return;
  }

  isDevMode() && console.log("Website blocked:", restrictedWebsite);
  redirectToWaitPage(details);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["isActivated"]).then(result => {
    const activatedVersion = result["isActivated"] || undefined;
    console.log("activatedVersion: " + activatedVersion);
    if (!activatedVersion) {
      writeDefaultConfig();
      chrome.tabs.create({ url: chrome.runtime.getURL("index.html#options/about") });
    }
  });
});

chrome.runtime.onUpdateAvailable.addListener(function (details) {
  chrome.action.setBadgeText({ text: "New" });
  chrome.action.setBadgeTextColor({ color: "#fff" });
  chrome.action.setBadgeBackgroundColor({ color: fullConfig.theme.colors.purple["600"] });
  console.log("Digital Araweness is ready to be updated (v" + details.version + ")");
});

chrome.action.onClicked.addListener(function () {
  chrome.runtime.requestUpdateCheck(function (statut) {
    if (statut == "update_available") {
      chrome.action.setBadgeText({ text: "" });
      chrome.runtime.reload();
    }
  });
});

function redirectToWaitPage(details: any) {
  const redirectUrl = chrome.runtime.getURL(
    "index.html#blocked/" + encodeURIComponent(btoa(details.url)),
  );
  chrome.tabs.update(details.tabId, { url: redirectUrl });
}
