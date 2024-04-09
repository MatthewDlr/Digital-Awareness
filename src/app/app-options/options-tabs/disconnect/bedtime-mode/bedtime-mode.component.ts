import { ChangeDetectorRef, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { animate, query, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy } from "@angular/core";

export const smoothHeight = trigger("HeightChange", [
  transition(
    "* => *",
    [
      query(":self", style({ height: "{{startHeight}}px" })),
      query(":self", [animate("0.25s ease-in-out", style({ height: "*" }))]),
    ],
    { params: { startHeight: 0 } },
  ),
]);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-bedtime-mode",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./bedtime-mode.component.html",
  styleUrl: "./bedtime-mode.component.css",
  animations: [smoothHeight],
})
export class BedtimeModeComponent {
  bedtimeMode!: boolean;
  bedtimeStart!: string;
  bedtimeEnd!: string;
  isBedtimeStartCorrect: boolean = true;
  isBedtimeEndCorrect: boolean = true;

  constructor(
    private soundsEngine: SoundsEngineService,
    private cdr: ChangeDetectorRef,
  ) {
    chrome.storage.sync.get("bedtimeMode").then(result => {
      this.bedtimeMode = result["bedtimeMode"];
      this.cdr.detectChanges();
    });
  }

  toggleBedtimeMode() {
    if (this.bedtimeMode) {
      this.soundsEngine.switchOFF();
      this.bedtimeMode = false;
    } else {
      this.soundsEngine.switchON();
      this.bedtimeMode = true;
    }

    chrome.storage.sync.set({
      bedtimeMode: this.bedtimeMode,
    });
  }

  setBedtimeStartDate() {
    throw new Error("Method not implemented.");
  }
}
