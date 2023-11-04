import { Component, isDevMode } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  currentTab: string = "blocklist"

  isDevModeEnabled() {
    return isDevMode();
  }

}
