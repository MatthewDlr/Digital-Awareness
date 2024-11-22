import { isDevMode } from "@angular/core";
import { BedtimeMode } from "app/types/bedtimeMode.type";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";

export async function getExtensionVersion(): Promise<string> {
  const result = await chrome.storage.sync.get("extensionVersion");
  isDevMode() && console.log("Extension version:", result["extensionVersion"]);
  return result["extensionVersion"];
}

export async function setExtensionVersion(extensionVersion: string) {
  await chrome.storage.sync.set({ extensionVersion });
}

export async function getAwarenessPageWidget(): Promise<string> {
  const result = await chrome.storage.sync.get("awarenessPageWidget");
  isDevMode() && console.log("Page widget:", result["awarenessPageWidget"]);
  return result["awarenessPageWidget"];
}

export async function setAwarenessPageWidget(awarenessPageWidget: string) {
  await chrome.storage.sync.set({ awarenessPageWidget });
}

export async function getAwarenessPageTasks(): Promise<string[]> {
  const result = await chrome.storage.sync.get("awarenessPageTasks");
  isDevMode() && console.log("Page tasks:", result["awarenessPageTasks"]);
  return result["awarenessPageTasks"];
}

export async function setAwarenessPageTasks(awarenessPageTasks: string[]) {
  await chrome.storage.sync.set({ awarenessPageTasks });
}

export async function getRestrictedWebsites(): Promise<Map<string, RestrictedWebsite>> {
  try {
    const result = await chrome.storage.sync.get("restrictedWebsites");
    return new Map<string, RestrictedWebsite>(Object.entries(result["restrictedWebsites"] || []));
  } catch (error) {
    console.error("Failed to retrieve restricted websites:", error);
    return new Map<string, RestrictedWebsite>(); // Return an empty Map in case of error
  }
}

export async function setRestrictedWebsites(restrictedWebsitesMap: Map<string, RestrictedWebsite>) {
  const restrictedWebsites = Object.fromEntries(restrictedWebsitesMap);
  await chrome.storage.sync.set({ restrictedWebsites });
}

export async function getDoomScrollingToggle(): Promise<boolean> {
  const result = await chrome.storage.sync.get("doomScrollingToggle");
  isDevMode() && console.log("Doom scrolling toggle:", result["doomScrollingToggle"]);
  return result["doomScrollingToggle"];
}

export async function setDoomScrollingToggle(doomScrollingToggle: boolean) {
  await chrome.storage.sync.set({ doomScrollingToggle });
}

export async function getBedtimeMode(): Promise<BedtimeMode> {
  const result = await chrome.storage.sync.get("bedtimeMode");
  isDevMode() && console.log("Bedtime mode:", result["bedtimeMode"]);
  return result["bedtimeMode"];
}

export async function setBedtimeMode(bedtimeMode: BedtimeMode) {
  await chrome.storage.sync.set({ bedtimeMode });
}
