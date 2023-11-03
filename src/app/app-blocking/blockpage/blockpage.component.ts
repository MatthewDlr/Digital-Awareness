import { Component, NgZone, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quotes } from '../services/quotes';
import { AllowedSitesService } from '../services/allowed-sites/allowed-sites.service';

@Component({
  selector: 'app-blockpage',
  templateUrl: './blockpage.component.html',
  styleUrls: ['./blockpage.component.css'],
})
export class BlockPageComponent {
  storedTimerValue!: number;
  timerValue!: number;
  quoteText!: string;
  quoteAuthor!: string;
  outputUrl!: URL;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private quote: Quotes,
    private allowedSitesService: AllowedSitesService
  ) {
    // Getting url parameters
    this.route.params.subscribe((params) => {
      const tabId = atob(params['tabId']);
      this.outputUrl = new URL(atob(params['outputURL']));
    });

    // Getting timer value from the storage
    if (this.isDevModeEnabled()) {
      this.timerValue = 5;
      this.countdown();
    } else {
      chrome.storage.sync.get('timerValue', (result) => {
        this.ngZone.run(() => {
          this.storedTimerValue = result['timerValue'];
          this.timerValue = this.storedTimerValue ? this.storedTimerValue : 30;
        });
        this.countdown();
      });
    }

    // Getting a random quote
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
    }
  }

  skipTimer() {
    // This means failure as the user has waited for the timer to expire
    const newTimerValue = Math.min(this.storedTimerValue + 5, 180);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    this.allowedSitesService.addAllowedSite(this.outputUrl.host, 5);
    window.location.href = this.outputUrl.toString();
  }

  closeBlockPage() {
    // This means success as the user left the page before the timer expired
    const newTimerValue = Math.max(this.storedTimerValue - 1, 30);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    window.close();
  }

  isDevModeEnabled() {
    return isDevMode();
  }
}
