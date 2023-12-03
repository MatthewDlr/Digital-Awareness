import { Component, isDevMode } from "@angular/core";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-pending-changes",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pending-changes.component.html",
  styleUrls: ["./pending-changes.component.css"],
})
export class PendingChangesComponent {
  areChangesPending: boolean = false;
  validationDate: string = "";
  expirationDate: string = "";
  canChangesBeValidated: boolean = false;

  timeToAdd = isDevMode() ? 1000 * 15 : 1000 * 60 * 60;

  constructor(
    private pendingChangesService: PendingChangesService,
  ) {
    this.pendingChangesService.areChangesPending.subscribe({
      next: (state) => {
        this.areChangesPending = state;
      },
    });
    this.pendingChangesService.canChangesBeValidated.subscribe({
      next: (state) => {
        this.canChangesBeValidated = state;
      },
    });
    this.pendingChangesService.validationDate.subscribe({
      next: (date) => {
        this.validationDate = String(
          date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0"),
        );
        const expirationDate = new Date(date.getTime() + this.timeToAdd);
        this.expirationDate = String(expirationDate.getHours() + ":" + String(expirationDate.getMinutes()).padStart(2, "0"));
      },
    });
  }

  discardChanges() {
    this.pendingChangesService.discardPendingChanges();
  }

  confirmChanges() {
    if (this.canChangesBeValidated) {
      this.pendingChangesService.confirmPendingChanges();
    }
  }
}
