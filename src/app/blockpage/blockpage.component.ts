import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-blockpage',
  templateUrl: './blockpage.component.html',
  styleUrls: ['./blockpage.component.css'],
})
export class BlockPageComponent {
  timerValue!: number;

  constructor(private ngZone: NgZone) {
    chrome.storage.sync.get('timerValue', (result) => {
      this.ngZone.run(() => {
        this.timerValue = result['timerValue'];
      });
      this.countdown();
    });
  }

  countdown() {
    if (this.timerValue > 0) {
      setTimeout(() => {
        this.ngZone.run(() => {  
          this.timerValue--;
          this.countdown();
        });
      }, 1050);
    }
  }
}
