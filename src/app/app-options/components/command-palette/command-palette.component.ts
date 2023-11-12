import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommandPaletteService } from '../../services/command-palette/command-palette.service';
import { commonWebsites, Website } from '../websites-list';
import { watchedWebsite, category } from '../../../types';
import FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPaletteComponent implements AfterViewInit {
  searchResults: Website[] = commonWebsites;
  userWebsites: watchedWebsite[] = [];
  enforcedWebsites: watchedWebsite[] = [];
  selectedWebsites: Website[] = [];
  suggestion: { category: category; performed: boolean } = {
    category: category.unknown,
    performed: false,
  };

  constructor(private commandPaletteService: CommandPaletteService) {
    chrome.storage.sync.get('userWebsites').then((result) => {
      this.userWebsites = result['userWebsites'];
      this.matchCommonAndUserWebsites();
    });
    chrome.storage.local.get('enforcedWebsites').then((result) => {
      this.enforcedWebsites = result['enforcedWebsites'];
      this.matchCommonAndUserWebsites();
    });
  }

  // Focus on the search input when the component is loaded
  @ViewChild('search') searchInput!: ElementRef;
  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  // Listen for the enter key, esc or cmd+k/ctrl+k to validate
  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.escape', ['$event'])
  @HostListener('document:keydown.meta.k', ['$event'])
  @HostListener('document:keydown.control.k', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.blockSelectedWebsites();
  }

  blockSelectedWebsites() {
    for (let website of this.selectedWebsites) {
      let blockedWebsite: watchedWebsite = {
        host: website.url,
        allowedUntil: '',
        timesBlocked: 0,
        timesAllowed: 0,
        category: website.category || category.unknown,
      };
      this.userWebsites.push(blockedWebsite);
    }
    console.log(this.selectedWebsites);
    chrome.storage.sync
      .set({ userWebsites: this.userWebsites })
      .then((result) => {
        for (let website of this.selectedWebsites) {
          website.selected = false;
        }
        this.selectedWebsites = [];
        this.toggleCommandPalette(false);
      })
      .catch((error) => {
        console.error('Error while blocking websites:', error);
      });
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  toggleWebsiteSelection(website: Website) {
    if (website.isBlocked) {
      return;
    }

    if (website.selected) {
      const index = this.selectedWebsites.indexOf(website);
      this.selectedWebsites.splice(index, 1);
      website.selected = false;
    } else {
      this.selectedWebsites.push(website);
      website.selected = true;
    }
  }

  processSearch(event: Event) {
    let searchQuery = (event.target as HTMLInputElement).value;

    // Removing the www. and the url parameters
    if (searchQuery.substring(0, 3) == 'www')
      searchQuery = searchQuery.substring(4);
    if (searchQuery.includes('/')) {
      searchQuery = searchQuery.substring(0, searchQuery.indexOf('/'));
    }

    var fuzzy = new FuzzySearch(commonWebsites, ['url', 'category'], {
      caseSensitive: false,
      sort: true,
    });
    this.searchResults = fuzzy.search(searchQuery);
    if (this.searchResults.length == 0) {
      this.generateResults(searchQuery);
    }

    this.processSuggestion(searchQuery.trim());
  }

  processSuggestion(searchQuery: string) {
    for (let value of Object.values(category)) {
      let search =
        searchQuery.charAt(0).toUpperCase() +
        searchQuery.slice(1).toLowerCase();
      if (
        value.toString() == search &&
        !(value.toString() == this.suggestion.category.toString())
      ) {
        this.suggestion.category = value;
        this.suggestion.performed = false;
      }
    }
  }

  performSuggestion() {
    for (let website of commonWebsites) {
      if (website.category == this.suggestion.category && !website.isBlocked) {
        if (!this.suggestion.performed) {
          this.selectedWebsites.push(website);
          website.selected = true;
        } else {
          const index = this.selectedWebsites.indexOf(website);
          this.selectedWebsites.splice(index, 1);
          website.selected = false;
        }
      }
    }
    this.suggestion.performed = !this.suggestion.performed;
  }

  matchCommonAndUserWebsites() {
    for (let searchResult of this.searchResults) {
      const isBlocked = Boolean(
        this.userWebsites.find((website) => {
          return website.host == searchResult.url;
        }) ||
          this.enforcedWebsites.find((website) => {
            return website.host == searchResult.url;
          }),
      );
      searchResult.isBlocked = isBlocked;
    }
  }

  generateResults(text: string) {
    // Check if the url end with a . + 2 or 3 letters
    const regex = new RegExp(/\.([a-z]{2,4})$/);
    const match = text.match(regex);

    if (match) {
      this.searchResults.push({ url: text, category: category.unknown });
    } else {
      if (text.endsWith('.')) {
        text = text.substring(0, text.length - 1);
      }
      this.searchResults.push({
        url: text + '.com',
        category: category.unknown,
      });
      this.searchResults.push({
        url: text + '.org',
        category: category.unknown,
      });
      this.searchResults.push({
        url: text + '.net',
        category: category.unknown,
      });
      this.searchResults.push({
        url: text + '.co',
        category: category.unknown,
      });
    }
    this.matchCommonAndUserWebsites();
  }
}
