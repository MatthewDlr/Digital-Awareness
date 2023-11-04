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
  tabId!: string;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private quote: Quotes,
    private allowedSitesService: AllowedSitesService
  ) {
    // Getting url parameters
    this.route.params.subscribe((params) => {
      this.tabId = decodeURIComponent(params['tabId']);
      this.outputUrl = new URL(decodeURIComponent(params['outputURL']));
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
          async function getCurrentTab() {
            let queryOptions = { active: true, lastFocusedWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);
            return tab.id;
          }

          getCurrentTab().then((currentTabId) => {
            if (currentTabId?.toString() != this.tabId) {
            } else {
              this.timerValue--;
            }
            this.countdown();
          });
        });
      }, 1100);
    }
  }

  // This means failure as the user has waited for the timer to expire
  skipTimer() {
    const newTimerValue = Math.min(this.storedTimerValue + 5, 180);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    if (this.isDevModeEnabled()) {
      this.allowedSitesService.addAllowedSite(this.outputUrl.host, 1); // Allow for 1 min
    } else {
      this.allowedSitesService.addAllowedSite(this.outputUrl.host, 30); // Allow for 30 min
    }
    window.location.href = this.outputUrl.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    const newTimerValue = Math.max(this.storedTimerValue - 1, 30);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    window.close();
  }

  isDevModeEnabled() {
    return isDevMode();
  }
}
