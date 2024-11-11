import { Component, isDevMode } from "@angular/core";

@Component({
  selector: "complete-setup",
  standalone: true,
  imports: [],
  templateUrl: "./complete-setup.component.html",
  styleUrl: "./complete-setup.component.css",
})
export class CompleteSetupComponent {
  isSetupCompleted = true;

  constructor() {
    this.checkIfSetupCompleted();
  }

  async checkIfSetupCompleted() {
    chrome.storage.local.get("isSetupDismissed").then(async result => {
      const isSetupDismissed = result["isSetupDismissed"] || false;
      const isAllowedIncognitoAccess = await chrome.extension.isAllowedIncognitoAccess();
      this.isSetupCompleted = isSetupDismissed || isAllowedIncognitoAccess;
      isDevMode() ? console.info("Setup state: ", this.isSetupCompleted) : null;
    });
  }

  dismissSetup() {
    chrome.storage.local.set({ isSetupDismissed: true }).then(() => {
      this.isSetupCompleted = true;
      isDevMode() ? console.info("Setup dismissed") : null;
    });
  }

  openExtensionSettings() {
    chrome.tabs.create({ url: "chrome://extensions/?id=" + chrome.runtime.id });
  }
}
