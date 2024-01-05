import { Component, isDevMode } from "@angular/core";
import { PendingChangesService } from "../../services/pending-changes/pending-changes.service";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "src/app/services/soundsEngine/sounds-engine.service";

@Component({
  selector: "app-pending-changes",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pending-changes.component.html",
  styleUrls: ["./pending-changes.component.css"],
})
export class PendingChangesComponent {
  validationDate: string = "";
  expirationDate: string = "";
  stage: string = "NoChanges";

  timeToAdd = isDevMode() ? 1000 * 15 : 1000 * 60 * 60;

  constructor(
    private soundsEngine: SoundsEngineService,
    private pendingChangesService: PendingChangesService,
  ) {
    this.pendingChangesService.validationDate.subscribe({
      next: date => {
        this.validationDate = String(date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0"));
        const expirationDate = new Date(date.getTime() + this.timeToAdd);
        this.expirationDate = String(expirationDate.getHours() + ":" + String(expirationDate.getMinutes()).padStart(2, "0"));
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
    if (this.stage != "ChangesCanBeValidated") {
      this.soundsEngine.notAllowed();
      return;
    }
    this.pendingChangesService.confirmPendingChanges();
  }
}
