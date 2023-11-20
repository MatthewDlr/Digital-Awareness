import { Component, NgZone, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quotes } from '../services/quotes';
import { AllowedSitesService } from '../services/allowed-sites/allowed-sites.service';

@Component({
  selector: 'app-awareness-page',
  templateUrl: './awareness-page.component.html',
  styleUrls: ['./awareness-page.component.css'],
})
export class AwarenessPageComponent {
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
    private allowedSitesService: AllowedSitesService,
  ) {
    // Getting url parameters
    this.route.params.subscribe((params) => {
      this.tabId = decodeURIComponent(params['tabId']);
      this.outputUrl = new URL(decodeURIComponent(params['outputURL']));
    });

    // Getting timer value from the storage
    if (isDevMode()) {
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
            if (currentTabId?.toString() != this.tabId || !document.hasFocus()) {
            } else {
              this.timerValue--;
            }
            this.countdown();
          });
        });
      }, 1100); // Yes, it's more than 1s
    } else {
      this.waitBeforeClose();
    }
  }

  waitBeforeClose() {
    setTimeout(() => {
      this.closeBlockPage();
    }, 15000);
  }

  // This means failure as the user has waited for the timer to expire
  skipTimer() {
    const newTimerValue = Math.min(this.storedTimerValue + 10, 180);
    chrome.storage.sync.set({ timerValue: newTimerValue });

    const minutesAllowed = isDevMode() ? 1 : 30;
    this.allowedSitesService.allowWebsiteTemporary(
      this.outputUrl.host,
      minutesAllowed,
    );

    window.location.href = this.outputUrl.toString();
  }

  // This means success as the user left the page before the timer expired
  closeBlockPage() {
    const newTimerValue = Math.max(this.storedTimerValue - 1, 30);
    chrome.storage.sync.set({ timerValue: newTimerValue });
    this.allowedSitesService.incrementTimesBlocked(this.outputUrl.host)
    setTimeout(() => {
      window.close();
    }, 500);
  }
}
