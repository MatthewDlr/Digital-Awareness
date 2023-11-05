import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommandPaletteService } from '../../services/command-palette/command-palette.service';
import {
  commonWebsites,
  Website,
} from '../../options-components/websites-list';
import { blockedSite } from '../../../types';
import FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPaletteComponent implements AfterViewInit {
  searchResults: Website[] = commonWebsites;
  blockedWebsites: blockedSite[] = [];

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

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  processSearch(event: Event) {
    let searchQuery = (event.target as HTMLInputElement).value;

    // Removing the www. and the url parameters
    if (searchQuery.substring(0, 3) == 'www')
      searchQuery = searchQuery.substring(4);
    if (searchQuery.includes('/')) {
      searchQuery = searchQuery.substring(0, searchQuery.indexOf('/'));
    }

    console.log(searchQuery);
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
      const isBlocked = this.blockedWebsites.find((website) => {
        return website.url == searchResult.url;
      })
        ? true
        : false;
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
      this.searchResults.push({ url: text, category: '' });
    } else {
      if (text.endsWith('.')) {
        text = text.substring(0, text.length - 1);
      }

      this.searchResults.push({ url: text + '.com', category: '' });
      this.searchResults.push({ url: text + '.org', category: '' });
      this.searchResults.push({ url: text + '.net', category: '' });
      this.searchResults.push({ url: text + '.co', category: '' });
    }
  }
}
