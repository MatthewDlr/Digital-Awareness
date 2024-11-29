import { ChangeDetectorRef, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { animate, query, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy } from "@angular/core";
import { BedtimeMode, convertTime } from "app/types/bedtimeMode.type";
import { getBedtimeMode, setBedtimeMode } from "app/shared/chrome-storage-api";

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
    imports: [CommonModule],
    templateUrl: "./bedtime-mode.component.html",
    styleUrl: "./bedtime-mode.component.css",
    animations: [smoothHeight]
})
export class BedtimeModeComponent {
  bedtimeMode: BedtimeMode = this.getDefaultConfig();
  isBedtimeStartCorrect = true;
  isBedtimeEndCorrect = true;

  constructor(
    private soundsEngine: SoundsEngineService,
    private cdr: ChangeDetectorRef,
  ) {
    getBedtimeMode().then(bedtimeMode => {
      if (bedtimeMode) this.bedtimeMode = bedtimeMode;
      this.cdr.detectChanges();
    });
  }

  toggleMode() {
    if (this.bedtimeMode.isEnabled) {
      this.soundsEngine.switchOFF();
      this.bedtimeMode.isEnabled = false;
    } else {
      this.soundsEngine.switchON();
      this.bedtimeMode.isEnabled = true;
    }

    this.updateBedtimePreferences();
  }

  setStartDate(value: string) {
    const time: { hours: number; minutes: number } = convertTime(value);

    if (time.hours > 2 && time.hours < 20) {
      this.isBedtimeStartCorrect = false;
    } else {
      this.isBedtimeStartCorrect = true;
      this.bedtimeMode.startAt.hours = time.hours;
      this.bedtimeMode.startAt.minutes = time.minutes;
      this.updateBedtimePreferences();
    }
  }

  setEndDate(value: string) {
    const time: { hours: number; minutes: number } = convertTime(value);

    if (time.hours >= 2 && time.hours <= 10) {
      this.isBedtimeEndCorrect = true;
      this.bedtimeMode.endAt.hours = time.hours;
      this.bedtimeMode.endAt.minutes = time.minutes;
      this.updateBedtimePreferences();
    } else {
      this.isBedtimeEndCorrect = false;
    }
  }

  timeToString(time: { hours: number; minutes: number }): string {
    return String(time.hours).padStart(2, "0") + ":" + String(time.minutes).padStart(2, "0");
  }

  private async updateBedtimePreferences() {
    await setBedtimeMode(this.bedtimeMode);
  }

  private getDefaultConfig(): BedtimeMode {
    return {
      isEnabled: false,
      startAt: { hours: 23, minutes: 0 },
      endAt: { hours: 7, minutes: 0 },
    };
  }
}
