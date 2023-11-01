import { Component, NgZone } from '@angular/core';
import { Quotes } from './quotes';

@Component({
  selector: 'app-blockpage',
  templateUrl: './blockpage.component.html',
  styleUrls: ['./blockpage.component.css'],
})
export class BlockPageComponent {
  timerValue!: number;
  quoteText!: string;
  quoteAuthor!: string;

  constructor(private ngZone: NgZone, private quote: Quotes) {
    chrome.storage.sync.get('timerValue', (result) => {
      this.ngZone.run(() => {
        this.timerValue = result['timerValue'];
      });
      this.countdown();
    });
    const randomQuote = this.quote.getRandomQuote();
    this.quoteText = randomQuote.text;
    this.quoteAuthor = randomQuote.author;
  }

  countdown() {
    if (this.timerValue > 0) {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.timerValue--;
          this.countdown();
        });
      }, 1100);
    } else {
      this.skipTimer();
    }
  }

  skipTimer() {
    const newTimerValue = Math.min(this.timerValue + 5, 180);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    // TODO: redirect to the intended page
  }

  closeBlockPage() {
    const newTimerValue = Math.max(this.timerValue - 1, 30);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    window.close();
  }
}
