import { Injectable } from "@angular/core";
import FuzzySearch from "fuzzy-search";
import { mostPopularWebsites, Website, searchSuggestions } from "../../common/websites-list";
import { watchedWebsite, category } from "../../../types";

const COMMONS_HOSTS_EXTENSIONS = [".com", ".org", ".io", ".co"];

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private websiteSearch: FuzzySearch<Website>;
  private enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];
  suggestions: searchSuggestions = {
    Suggestions: [],
    Results: [],
    Selected: [],
  };

  constructor() {
    this.loadStoredWebsites();
    this.websiteSearch = new FuzzySearch(mostPopularWebsites, ["host", "category"], {
      caseSensitive: false,
      sort: true,
    });
  }

  performSearch(searchQuery: string) {
    if (searchQuery.trim() == "") {
      this.suggestions.Suggestions = [];
      this.suggestions.Results = [];
      return;
    }

    searchQuery = this.cleanURL(searchQuery);
    this.searchInWebsites(searchQuery);
    this.generateCustomWebsites(searchQuery);
  }

  addSelectedWebsite(website: Website) {
    if (this.suggestions.Selected.find(selectedWebsite => selectedWebsite.host == website.host)) {
      return;
    }
    this.suggestions.Selected.push(website);
  }

  removeSelectedWebsite(website: Website) {
    const index = this.suggestions.Selected.indexOf(website);
    this.suggestions.Selected.splice(index, 1);
  }

  clearSuggestions() {
    for (const website of this.suggestions.Selected) {
      website.isSelected = false;
    }
    this.suggestions.Selected = [];
    this.suggestions.Suggestions = [];
    this.suggestions.Results = [];
  }

  loadStoredWebsites() {
    chrome.storage.sync.get("userWebsites").then(result => {
      this.userWebsites = result["userWebsites"] || [];
    });
    chrome.storage.sync.get("enforcedWebsites").then(result => {
      this.enforcedWebsites = result["enforcedWebsites"] || [];
    });
  }

  private searchInWebsites(searchQuery: string) {
    const searchResults = this.websiteSearch.search(searchQuery).slice(0, 5);
    searchResults.forEach(website => {
      website.isBlocked = this.isWebsiteBlocked(website.host);
    });
    this.suggestions.Suggestions = searchResults;
  }

  private generateCustomWebsites(searchQuery: string) {
    this.suggestions.Results = [];

    // Check if the url end with a . + 2, 3 or 4 characters
    const hasAnExtension = searchQuery.match(new RegExp(/\.([a-z0-9]{2,5})$/));
    if (!hasAnExtension) {
      for (const extension of COMMONS_HOSTS_EXTENSIONS) {
        this.suggestions.Results.push({
          host: searchQuery + extension,
          category: category.unknown,
          isBlocked: this.isWebsiteBlocked(searchQuery + extension) ? true : false,
        });
      }
    }
    this.suggestions.Results.push({
      host: searchQuery,
      category: category.unknown,
      isBlocked: this.isWebsiteBlocked(searchQuery) ? true : false,
    });
  }

  private isWebsiteBlocked(host: string): boolean {
    if (this.enforcedWebsites.find(watchedWebsite => watchedWebsite.host == host)) {
      return true;
    }
    if (this.userWebsites.find(watchedWebsite => watchedWebsite.host == host)) {
      return true;
    }
    return false;
  }

  private cleanURL(url: string): string {
    url = url.trim();

    if (url.substring(0, 4) == "www.") {
      url = url.substring(4);
    }

    if (url.includes("/")) {
      url = url.substring(0, url.indexOf("/"));
    }
    return url;
  }
}
