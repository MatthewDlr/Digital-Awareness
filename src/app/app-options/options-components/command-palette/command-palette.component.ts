import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommandPaletteService } from '../../services/command-palette/command-palette.service';
import {
  commonWebsites,
  Website,
} from '../../options-components/websites-list';
import { blockedSite, category } from '../../../types';
import FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPaletteComponent implements AfterViewInit {
  searchResults: Website[] = commonWebsites;
  blockedWebsites: blockedSite[] = [];
  selectedWebsites: Website[] = [];

  constructor(private commandPaletteService: CommandPaletteService) {
    chrome.storage.sync.get('blockedWebsites').then((result) => {
      this.blockedWebsites = result['blockedWebsites'];
      this.matchCommonAndBlockedWebsites();
    });
  }

  @ViewChild('search') searchInput!: ElementRef;
  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.blockSelectedWebsites();
  }

  blockSelectedWebsites() {
    for (let website of this.selectedWebsites) {
      let blockedWebsite: blockedSite = {
        url: website.url,
        allowedUntil: '',
        isMandatory: false,
        timesBlocked: 0,
        timesAllowed: 0,
        category: website.category || category.unknown,
      };

      this.blockedWebsites.push(blockedWebsite);
      website.selected = false;
    }
    console.log(this.blockedWebsites);
    chrome.storage.sync
      .set({ blockedWebsites: this.blockedWebsites })
      .then((result) => {
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
  }

  matchCommonAndBlockedWebsites() {
    for (let searchResult of this.searchResults) {
      const isBlocked = Boolean(
        this.blockedWebsites.find((website) => {
          return website.url == searchResult.url;
        }),
      );
      searchResult.isBlocked = isBlocked;
    }
  }

  generateResults(text: string) {
    if (
      text.endsWith('.com') ||
      text.endsWith('.org') ||
      text.endsWith('.net') ||
      text.endsWith('.io') ||
      text.endsWith('.edu') ||
      text.endsWith('.us') ||
      text.endsWith('.ru') ||
      text.endsWith('.co') ||
      text.endsWith('.fr') ||
      text.endsWith('.de') ||
      text.endsWith('.uk')
    ) {
      this.searchResults.push({ url: text, category: category.unknown });
    } else {
      if (text.endsWith('.')) {
        text = text.substring(0, text.length - 1);
      }

      this.searchResults.push({ url: text + '.com', category: category.unknown });
      this.searchResults.push({ url: text + '.org', category: category.unknown });
      this.searchResults.push({ url: text + '.net', category: category.unknown });
      this.searchResults.push({ url: text + '.co', category: category.unknown });
    }
  }
}
