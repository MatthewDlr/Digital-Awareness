import { Injectable, isDevMode } from "@angular/core";
import FuzzySearch from "fuzzy-search";
import { mostPopularWebsites, Website, searchSuggestions } from "../../common/websites-list";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { watchedWebsite, category } from "../../../types";

const COMMONS_HOSTS_EXTENSIONS = [".com", ".org", ".io", ".co"];

@Injectable({
  providedIn: "root",
})
export class SearchSuggestionsService {
  private websiteSearch: FuzzySearch<Website>;
  private enforcedWebsites: watchedWebsite[] = [];
  userWebsites: watchedWebsite[] = [];
  results: searchSuggestions = {
    websites: [],
    customWebsites: [],
    selectedWebsites: [],
  };

  constructor() {
    chrome.storage.sync.get("userWebsites").then(result => {
      this.userWebsites = result["userWebsites"] || [];
    });
    chrome.storage.local.get("enforcedWebsites").then(result => {
      this.enforcedWebsites = result["enforcedWebsites"] || [];
    });

    this.websiteSearch = new FuzzySearch(mostPopularWebsites, ["url", "category"], {
      caseSensitive: false,
      sort: true,
    });
  }

  performSearch(searchQuery: string) {
    if (searchQuery.trim() == "") {
      this.results.websites = [];
      this.results.customWebsites = [];
      return;
    }

    searchQuery = this.cleanURL(searchQuery);
    isDevMode() ? console.log("searchQuery: ", searchQuery) : null;
    this.searchInWebsites(searchQuery);
    this.generateCustomWebsites(searchQuery);
  }

  addSelectedWebsite(website: Website) {
    if (this.results.selectedWebsites.find(selectedWebsite => selectedWebsite.host == website.host)) {
      return;
    }
    this.results.selectedWebsites.push(website);
  }

  removeSelectedWebsite(website: Website) {
    const index = this.results.selectedWebsites.indexOf(website);
    this.results.selectedWebsites.splice(index, 1);
  }

  private searchInWebsites(searchQuery: string) {
    let searchResults = this.websiteSearch.search(searchQuery);
    isDevMode() ? console.log(searchResults) : null;
    searchResults = searchResults.filter(result => !this.isWebsiteBlocked(result.host));
    searchResults.slice(0, 5);

    this.results.websites = searchResults;
  }

  private generateCustomWebsites(searchQuery: string) {
    this.results.customWebsites = [];

    // Check if the url end with a . + 2, 3 or 4 characters
    const hasAnExtension = searchQuery.match(new RegExp(/\.([a-z0-9]{2,5})$/));
    if (!hasAnExtension) {
      for (const extension of COMMONS_HOSTS_EXTENSIONS) {
        this.results.customWebsites.push({
          host: searchQuery + extension,
          category: category.unknown,
          isBlocked: this.isWebsiteBlocked(searchQuery + extension) ? true : false,
        });
      }
    }
    this.results.customWebsites.push({
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
