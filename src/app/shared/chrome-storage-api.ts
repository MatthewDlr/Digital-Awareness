import { BedtimeMode } from "app/types/bedtimeMode.type";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";

export async function getExtensionVersion(): Promise<string> {
  const result = await chrome.storage.sync.get("extensionVersion");
  return result["extensionVersion"];
}

export async function setExtensionVersion(extensionVersion: string) {
  await chrome.storage.sync.set({ extensionVersion });
}

export async function getAwarenessPageWidget(): Promise<string> {
  const result = await chrome.storage.sync.get("awarenessPageWidget");
  return result["awarenessPageWidget"];
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

export async function setRestrictedWebsites(restrictedWebsites: Map<string, RestrictedWebsite>) {
  await chrome.storage.sync.set({ restrictedWebsites });
}

export async function doomScrollingToggle(): Promise<boolean> {
  const result = await chrome.storage.sync.get("doomScrollingToggle");
  return result["doomScrollingToggle"];
}

export async function setDoomScrollingToggle(doomScrollingToggle: boolean) {
  await chrome.storage.sync.set({ doomScrollingToggle });
}

export async function getBedtimeMode(): Promise<BedtimeMode> {
  const result = await chrome.storage.sync.get("bedtimeMode");
  return result["bedtimeMode"];
}
