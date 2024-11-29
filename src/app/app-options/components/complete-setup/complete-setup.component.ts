import { Component } from "@angular/core";
import { getFinishSetupState, setFinishSetupState } from "app/shared/chrome-storage-api";

@Component({
  selector: "app-complete-setup",
  standalone: true,
  imports: [],
  templateUrl: "./complete-setup.component.html",
  styleUrl: "./complete-setup.component.css",
})
export class CompleteSetupComponent {
  isSetupCompleted = true;

  constructor() {
    getFinishSetupState().then(async isSetupDismissed => {
      const isIncognitoAccessAllowed = await chrome.extension.isAllowedIncognitoAccess();
      this.isSetupCompleted = isSetupDismissed || isIncognitoAccessAllowed;
    });
  }

  async dismissSetup() {
    await setFinishSetupState(true);
    this.isSetupCompleted = true;
  }

  openExtensionSettings() {
    chrome.tabs.create({ url: "chrome://extensions/?id=" + chrome.runtime.id });
  }
}
