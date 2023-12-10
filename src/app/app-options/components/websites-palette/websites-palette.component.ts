import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, isDevMode } from "@angular/core";
import { CommandPaletteService } from "../../services/command-palette/command-palette.service";
import { SearchService } from "../../services/search-suggestions/search-suggestions.service";
import { Website } from "../../common/websites-list";
import { watchedWebsite, category } from "../../../types";
import { SearchAnimationComponent } from "../search-animation/search-animation.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-websites-palette",
  standalone: true,
  imports: [CommonModule, SearchAnimationComponent, FormsModule],
  templateUrl: "./websites-palette.component.html",
  styleUrls: ["./websites-palette.component.css"],
})
export class WebsitesPaletteComponent implements AfterViewInit {
  saveError: boolean = false;
  searchQuery: string = "";

  constructor(
    private commandPaletteService: CommandPaletteService,
    public searchService: SearchService,
  ) {
    this.searchService.loadStoredWebsites();
    this.searchService.clearSuggestions();
  }

  @ViewChild("search") searchInput!: ElementRef;
  @ViewChild("saveError") saveErrorElement!: ElementRef;

  // Focus on the search input when the component is loaded
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
    const userWebsites = this.searchService.userWebsites;
    const selectedWebsites = this.searchService.suggestions.Selected;

    if (selectedWebsites.length == 0) {
      this.toggleCommandPalette(false);
      isDevMode() ? console.log("No websites selected, nothing to save") : null;
      return;
    }

    for (const selectedWebsite of selectedWebsites) {
      userWebsites.push(this.createWatchedWebsite(selectedWebsite));
    }
    chrome.storage.sync
      .set({ userWebsites: userWebsites })
      .then(() => {
        this.searchService.clearSuggestions();
        this.toggleCommandPalette(false);
        chrome.storage.sync.get("userWebsites").then(result => {
          console.log("Saved websites:", result["userWebsites"]);
        });
      })
      .catch(error => {
        this.saveError = true;
        this.searchService.loadStoredWebsites();
        console.error("Error while blocking websites:", error);
        setTimeout(() => {
          this.saveErrorElement.nativeElement.classList.remove("animate-shake");
          setTimeout(() => {
            this.saveErrorElement.nativeElement.classList.add("animate-shake");
          }, 25);
        }, 50);
      });
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  onSearch() {
    this.searchService.performSearch(this.searchQuery);
  }

  onClear() {
    this.searchQuery = "";
    this.searchService.performSearch(this.searchQuery);
  }

  toggleWebsiteSelection(website: Website) {
    if (website.isBlocked) {
      return;
    }
    website.isSelected = !website.isSelected;
    if (website.isSelected) {
      this.searchService.addSelectedWebsite(website);
    } else {
      this.searchService.removeSelectedWebsite(website);
    }
  }

  sortCategories = (a: any, b: any) => {
    const order: { [key: string]: number } = { Suggestions: 1, Results: 2, Selected: 3 };
    return (order[a.key] || 0) - (order[b.key] || 0);
  };

  private createWatchedWebsite(website: Website): watchedWebsite {
    return {
      host: website.host,
      timer: 30,
      allowedUntil: "",
      timesBlocked: 0,
      timesAllowed: 0,
      category: website.category || category.unknown,
    };
  }
}
