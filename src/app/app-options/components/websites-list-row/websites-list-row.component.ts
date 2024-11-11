import { AfterViewInit, Component, HostListener, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WatchedWebsite } from "app/types/watchedWebsite.type";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { FormsModule } from "@angular/forms";
import dayjs from "dayjs";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "tr[websites-list-row]",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./websites-list-row.component.html",
  styleUrl: "./websites-list-row.component.css",
})
export class WebsitesListRowComponent implements AfterViewInit {
  @Input({ required: true }) website!: WatchedWebsite;
  @Input({ required: true }) isEnforced!: boolean;
  @Input() isPending!: boolean;

  isEditEnabled = false;
  oldHost = "";
  awarenessColor = "";

  constructor(
    private cdRef: ChangeDetectorRef,
    private pendingChangesService: PendingChangesService,
    private soundsEngine: SoundsEngineService,
  ) {}

  ngAfterViewInit(): void {
    const lastOpen = dayjs(this.website.allowedAt);
    const minutesDiff = dayjs().diff(lastOpen, "minute") || 0;
    this.awarenessColor = this.determineAwarenessBadgeColor(minutesDiff);
    this.cdRef.detectChanges();
  }

  private determineAwarenessBadgeColor(minutesDiff: number): string {
    if (minutesDiff === 0) return "bg-green-500";
    if (minutesDiff < 1440) return "bg-red-500"; // < 1 day
    if (minutesDiff < 2880) return "bg-orange-500"; // < 2 days
    if (minutesDiff < 5760) return "bg-blue-500"; // < 4 days
    return "bg-green-500";
  }

  @HostListener("document:keydown.enter", ["$event"])
  onEnterHandler() {
    if (this.isEditEnabled) {
      this.editWebsite();
    }
    this.isEditEnabled = false;
  }

  @ViewChild("hostInput") input!: { nativeElement: HTMLInputElement };
  enableEdit() {
    if (this.isEnforced || this.isPending) {
      this.soundsEngine.notAllowed();
      return;
    }

    this.soundsEngine.select();
    this.isEditEnabled = true;
    this.oldHost = this.website.host;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 0);
  }

  editWebsite() {
    if (this.isEnforced || this.isPending) {
      this.soundsEngine.notAllowed();
      return;
    }

    this.website.host = this.website.host.trim();
    this.isEditEnabled = false;

    if (this.website.host !== "" && this.oldHost !== this.website.host) {
      this.pendingChangesService.addWebsiteToEdit(this.oldHost, this.website.host);
    }
  }

  removeWebsite() {
    if (this.isEnforced || this.isPending) {
      this.soundsEngine.notAllowed();
    } else {
      this.soundsEngine.erase();
      this.pendingChangesService.addWebsiteToRemove(this.website.host);
    }
  }
}
