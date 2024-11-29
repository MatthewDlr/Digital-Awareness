import { Component, isDevMode } from "@angular/core";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";

@Component({
    selector: "app-pending-changes",
    imports: [CommonModule],
    templateUrl: "./pending-changes.component.html",
    styleUrls: ["./pending-changes.component.css"]
})
export class PendingChangesComponent {
  validationDate = "";
  expirationDate = "";
  stage = "NoChanges";

  timeToAdd = isDevMode() ? 1000 * 15 : 1000 * 60 * 60; // Time required to wait in order to validate the changes

  constructor(
    private soundsEngine: SoundsEngineService,
    private pendingChangesService: PendingChangesService,
  ) {
    this.pendingChangesService.validationDate.subscribe({
      next: date => {
        this.validationDate = String(
          date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0"),
        );
        const expirationDate = new Date(date.getTime() + this.timeToAdd);
        this.expirationDate = String(
          expirationDate.getHours() + ":" + String(expirationDate.getMinutes()).padStart(2, "0"),
        );
      },
    });
    this.pendingChangesService.stage.subscribe({
      next: stage => {
        this.stage = stage.toString();
      },
    });

    console.log("stage: ", this.stage);
  }

  discardChanges() {
    this.soundsEngine.erase();
    this.pendingChangesService.discardPendingChanges();
  }

  confirmChanges() {
    if (this.stage != "ChangesCanBeValidated") return;

    this.pendingChangesService.confirmPendingChanges();
  }
}
