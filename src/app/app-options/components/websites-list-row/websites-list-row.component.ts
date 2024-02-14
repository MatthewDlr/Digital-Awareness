import { AfterViewInit, Component, HostListener, Input, ViewChild, ChangeDetectorRef, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { watchedWebsite } from "src/app/types/types";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";
import { ScoringService } from "src/app/services/scoring/scoring.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "tr[websites-list-row]",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./websites-list-row.component.html",
  styleUrl: "./websites-list-row.component.css",
})
export class WebsitesListRowComponent implements AfterViewInit {
  @Input({ required: true }) website!: watchedWebsite;
  @Input({ required: true }) isEnforced!: boolean;
  @Input() isPending!: boolean;

  isEditEnabled: boolean = false;
  oldHost: string = "";
  awarenessRatio = -1;
  isDevMode = isDevMode();

  constructor(
    private cdRef: ChangeDetectorRef,
    private pendingChangesService: PendingChangesService,
    private soundsEngine: SoundsEngineService,
    private scoringService: ScoringService,
  ) {}

  ngAfterViewInit(): void {
    this.awarenessRatio = this.scoringService.getScoreOf(this.website);
    this.cdRef.detectChanges();
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

    if (this.website.host != "" && this.oldHost !== this.website.host) {
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
