import { Component } from "@angular/core";

@Component({
  selector: "app-awareness-page-tab",
  templateUrl: "./awareness-page-tab.component.html",
  styleUrls: ["./awareness-page-tab.component.css"],
})
export class AwarenessPageTabComponent {
  selectedWidget: string = "Quotes";

  constructor() {
    chrome.storage.sync.get(["awarenessPageWidget"]).then((result) => {
      this.selectedWidget = result["awarenessPageWidget"];
    });
  }

  updateSelectedWidget(widget: string) {
    this.selectedWidget = widget;
    chrome.storage.sync.set({ awarenessPageWidget: widget });
  }
}
