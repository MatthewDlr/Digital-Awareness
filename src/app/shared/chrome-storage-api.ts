import { isDevMode } from "@angular/core";
import { BedtimeMode } from "app/types/bedtimeMode.type";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";
import { UserConfig } from "app/types/userConfig.type";

export async function setConfig(config: UserConfig) {
  try {
    await chrome.storage.local.set(config);
    console.info("Default configuration successfully written !");
  } catch (error) {
    throw new Error("Failed to set config: " + error);
  }
}

export async function getExtensionVersion(): Promise<string | undefined> {
  const result = await chrome.storage.local.get("extensionVersion");
  const extensionVersion = result["extensionVersion"] || undefined;
  isDevMode() && console.log("Extension version:", extensionVersion);
  return extensionVersion;
}

export async function setExtensionVersion(extensionVersion: string) {
  try {
    await chrome.storage.local.set({ extensionVersion });
  } catch (error) {
    throw new Error("Failed to set extension version: " + error);
  }
}

export async function getFinishSetupState(): Promise<boolean> {
  const result = await chrome.storage.local.get("isSetupDismissed");
  const isSetupDismissed = result["isSetupDismissed"] || false;
  isDevMode() && console.log("Setup state:", isSetupDismissed);
  return isSetupDismissed;
}

export async function setFinishSetupState(isSetupDismissed: boolean) {
  try {
    await chrome.storage.local.set({ isSetupDismissed });
  } catch (error) {
    throw new Error("Failed to set setup state: " + error);
  }
}

export async function getAwarenessPageWidget(): Promise<string> {
  const result = await chrome.storage.local.get("awarenessPageWidget");
  const widget: string = result["awarenessPageWidget"] || "Quotes";
  isDevMode() && console.log("Page widget:", widget);

  if (widget === "Random") {
    const widgets = ["Quotes", "Breathing", "Tasks"];
    const randomIndex = Math.floor(Math.random() * widgets.length);
    return widgets[randomIndex];
  } else {
    return widget;
  }
}

export async function setAwarenessPageWidget(awarenessPageWidget: string) {
  try {
    await chrome.storage.local.set({ awarenessPageWidget });
  } catch (error) {
    throw new Error("Failed to set awareness page widget: " + error);
  }
}

export async function getAwarenessPageTasks(): Promise<string[]> {
  const result = await chrome.storage.local.get("awarenessPageTasks");
  const tasks: string[] = result["awarenessPageTasks"] || ["", "", ""];
  const nonEmptyTasks = tasks.filter(task => task.length > 0);
  if (nonEmptyTasks.length === 0) {
    tasks[0] = "Why not start to reflect on what goal you want to accomplish?";
  }
  isDevMode() && console.log("Page tasks:", tasks);
  return tasks;
}

export async function setAwarenessPageTasks(awarenessPageTasks: string[]) {
  try {
    await chrome.storage.local.set({ awarenessPageTasks });
  } catch (error) {
    throw new Error("Failed to set awareness page tasks: " + error);
  }
}

export async function getRestrictedWebsites(): Promise<Map<string, RestrictedWebsite>> {
  const result = await chrome.storage.local.get("restrictedWebsites");
  return new Map<string, RestrictedWebsite>(Object.entries(result["restrictedWebsites"] || []));
}

export async function setRestrictedWebsites(restrictedWebsitesMap: Map<string, RestrictedWebsite>) {
  try {
    const restrictedWebsites = Object.fromEntries(restrictedWebsitesMap);
    await chrome.storage.local.set({ restrictedWebsites });
  } catch (error) {
    throw new Error("Failed to set restricted websites: " + error);
  }
}

export async function getDoomScrollingState(): Promise<boolean> {
  const result = await chrome.storage.local.get("doomScrollingToggle");
  const isDoomScrollingEnabled = result["doomScrollingToggle"] || false;
  isDevMode() && console.log("Doom scrolling toggle:", isDoomScrollingEnabled);
  return isDoomScrollingEnabled;
}

export async function setDoomScrollingState(doomScrollingToggle: boolean) {
  try {
    await chrome.storage.local.set({ doomScrollingToggle });
  } catch (error) {
    throw new Error("Failed to set doom scrolling toggle: " + error);
  }
}

export async function getBedtimeMode(): Promise<BedtimeMode | undefined> {
  const result = await chrome.storage.local.get("bedtimeMode");
  const bedtimeMode: BedtimeMode | undefined = result["bedtimeMode"] || undefined;
  isDevMode() && console.log("Bedtime mode:", bedtimeMode);
  return bedtimeMode;
}

export async function setBedtimeMode(bedtimeMode: BedtimeMode) {
  try {
    await chrome.storage.local.set({ bedtimeMode });
  } catch (error) {
    throw new Error("Failed to set bedtime mode: " + error);
  }
}
