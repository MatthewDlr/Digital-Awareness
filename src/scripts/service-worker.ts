import { writeDefaultConfig } from "../config";
import { isDevMode } from "@angular/core";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";
const fullConfig = resolveConfig(tailwindConfig);
import dayjs, { Dayjs } from "dayjs";
import { getRestrictedWebsites, getExtensionVersion } from "app/shared/chrome-storage-api";

chrome.webNavigation.onCommitted.addListener(async function (details) {
  // Avoid showing block page if the request is made in background or isn't http/https
  if (details.frameId != 0 || !details.url.startsWith("http")) return;

  const navigatedWebsite = new URL(details.url).host.replace("www.", "");

  const restrictedWebsites = await getRestrictedWebsites();
  if (restrictedWebsites.size === 0) return;

  const restrictedWebsite = restrictedWebsites.get(navigatedWebsite);
  if (!restrictedWebsite) {
    isDevMode() && console.log("Website not blocked: ", restrictedWebsite);
    return;
  }

  // If user has temporary allowed the website, let it pass
  const allowedUntil: Dayjs = dayjs(restrictedWebsite.allowedUntil);
  if (allowedUntil > dayjs()) {
    isDevMode() && console.log("Website temporary allowed until:", allowedUntil.toString());
    return;
  }

  // If website has never been allowed before, let it pass
  const allowedAt = restrictedWebsite.allowedAt;
  if (!allowedAt || allowedAt === "") {
    isDevMode() && console.log("Website allowed for the first time");
    return;
  }

  // If the last visit was more than 4 days ago, let it pass
  if (dayjs(allowedAt) < dayjs().subtract(4, "day")) {
    isDevMode() && console.log("Website allowed more than 4 days ago:", allowedAt.toString());
    return;
  }

  isDevMode() && console.log("Website blocked:", restrictedWebsite);
  const redirectUrl = chrome.runtime.getURL(
    "index.html#blocked/" + encodeURIComponent(btoa(details.url)),
  );
  chrome.tabs.update(details.tabId, { url: redirectUrl });
});

chrome.runtime.onInstalled.addListener(() => {
  getExtensionVersion().then(version => {
    if (!version) {
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
