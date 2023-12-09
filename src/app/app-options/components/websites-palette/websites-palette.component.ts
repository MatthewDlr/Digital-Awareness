import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, isDevMode } from "@angular/core";
import { CommandPaletteService } from "../../services/command-palette/command-palette.service";
import { SearchSuggestionsService } from "../../services/search-suggestions/search-suggestions.service";
import { Website } from "../../common/websites-list";
import { watchedWebsite, category } from "../../../types";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-websites-palette",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./websites-palette.component.html",
  styleUrls: ["./websites-palette.component.css"],
})
export class WebsitesPaletteComponent implements AfterViewInit {
  saveError: boolean = false;

  constructor(
    private commandPaletteService: CommandPaletteService,
    public searchSuggestionService: SearchSuggestionsService,
  ) {}

  // Focus on the search input when the component is loaded
  @ViewChild("search") searchInput!: ElementRef;
  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  // Listen for the enter key or cmd+k/ctrl+k to validate
  @HostListener("document:keydown.enter", ["$event"])
  @HostListener("document:keydown.meta.k", ["$event"])
  @HostListener("document:keydown.control.k", ["$event"])
  onKeydownHandler() {
    this.blockSelectedWebsites();
  }

  // Listen for the escape key to close without saving
  @HostListener("document:keydown.escape", ["$event"])
  onKeydownHandlerEscape() {
    this.toggleCommandPalette(false);
  }

  blockSelectedWebsites() {
    const userWebsites = this.searchSuggestionService.userWebsites;
    if (userWebsites.length == 0) {
      return;
    }

    for (const selectedWebsite of this.searchSuggestionService.results.selectedWebsites) {
      if (!userWebsites.find(userWebsite => userWebsite.host == selectedWebsite.host)) {
        userWebsites.push(this.createWatchedWebsite(selectedWebsite.host));
      }
    }
    isDevMode() ? console.log(userWebsites) : null;
    chrome.storage.sync
      .set({ userWebsites: userWebsites })
      .then(() => {
        this.saveError = false;
        this.toggleCommandPalette(false);
      })
      .catch(error => {
        console.error("Error while blocking websites:", error);
        this.saveError = true;
      });
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  onSearch(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSuggestionService.performSearch(searchQuery);
  }

  toggleWebsiteSelection(website: Website) {
    if (website.isBlocked) {
      return;
    }
    website.isSelected = !website.isSelected;
    if (website.isSelected) {
      this.searchSuggestionService.addSelectedWebsite(website);
    } else {
      this.searchSuggestionService.removeSelectedWebsite(website);
    }
  }

  sortCategories = (a: any, b: any) => {
    const order: { [key: string]: number } = { websites: 1, customWebsites: 2, selectedWebsites: 3 };
    return (order[a.key] || 0) - (order[b.key] || 0);
  };

  private createWatchedWebsite(host: string): watchedWebsite {
    return {
      host: host,
      timer: 30,
      allowedUntil: "",
      timesBlocked: 0,
      timesAllowed: 0,
      category: category.unknown,
    };
  }
}
