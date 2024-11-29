import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  isDevMode,
} from "@angular/core";
import { WebsitePaletteService } from "../../services/website-palette/website-palette.service";
import { SearchService } from "../../services/search-suggestions/search-suggestions.service";
import { Website } from "../../common/websites-list";
import { RestrictedWebsite } from "app/types/restrictedWebsite.type";
import { Category } from "app/types/category.type";
import { SearchAnimationComponent } from "../search-animation/search-animation.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { setRestrictedWebsites } from "app/shared/chrome-storage-api";

@Component({
  selector: "app-websites-palette",
  standalone: true,
  imports: [CommonModule, SearchAnimationComponent, FormsModule],
  templateUrl: "./websites-palette.component.html",
  styleUrls: ["./websites-palette.component.css"],
})
export class WebsitesPaletteComponent implements AfterViewInit {
  searchQuery = "";

  constructor(
    private soundsEngine: SoundsEngineService,
    private commandPaletteService: WebsitePaletteService,
    public searchService: SearchService,
  ) {
    this.searchService.clearSuggestions();
  }

  @ViewChild("search") searchInput!: ElementRef;

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

  async blockSelectedWebsites() {
    const restrictedWebsites = this.searchService.restrictedWebsites;
    const selectedWebsites = this.searchService.suggestions.Selected;

    if (selectedWebsites.length === 0) {
      this.toggleCommandPalette(false);
      isDevMode() && console.log("No websites selected, nothing to save");
      return;
    }

    for (const selectedWebsite of selectedWebsites) {
      restrictedWebsites.set(selectedWebsite.host, this.constructRestrictedWebsite(selectedWebsite));
    }

    try {
      await setRestrictedWebsites(restrictedWebsites);
      this.soundsEngine.appear();
      this.searchService.clearSuggestions();
    } catch (error) {
      this.soundsEngine.error();
      this.searchService.loadStoredWebsites();
      console.error("Error while blocking websites:", error);
    }
    this.toggleCommandPalette(false);
  }

  toggleCommandPalette(state: boolean) {
    this.commandPaletteService.toggleCommandPalette(state);
  }

  onSearch() {
    this.searchService.performSearch(this.searchQuery);
  }

  onClear() {
    this.searchQuery = "";
    this.soundsEngine.erase();
    this.searchService.performSearch(this.searchQuery);
  }

  toggleWebsiteSelection(website: Website) {
    if (website.isBlocked) return;

    this.soundsEngine.select();
    website.isSelected = !website.isSelected;
    website.isSelected
      ? this.searchService.addSelectedWebsite(website)
      : this.searchService.removeSelectedWebsite(website);
  }

  sortCategories = (a: any, b: any) => {
    const order: Record<string, number> = { Suggestions: 1, Results: 2, Selected: 3 };
    return (order[a.key] || 0) - (order[b.key] || 0);
  };

  private constructRestrictedWebsite(website: Website): RestrictedWebsite {
    return {
      host: website.host,
      allowedUntil: "",
      allowedAt: "",
      category: website.category || Category.unknown,
    };
  }
}
