import { ChangeDetectorRef, Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoundsEngineService } from "app/services/soundsEngine/sounds-engine.service";
import { animate, query, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy } from "@angular/core";
import { BedtimeMode, convertTime } from "app/types/bedtimeMode.type";

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
  bedtimeMode: BedtimeMode = this.getDefaultConfig();
  isBedtimeStartCorrect: boolean = true;
  isBedtimeEndCorrect: boolean = true;

  constructor(
    private soundsEngine: SoundsEngineService,
    private cdr: ChangeDetectorRef,
  ) {
    chrome.storage.sync
      .get("bedtimeMode")
      .then(result => {
        if (result["bedtimeMode"]) {
          this.bedtimeMode = result["bedtimeMode"];
          this.cdr.detectChanges();
          isDevMode() && console.log(this.bedtimeMode);
        }
      })
      .catch(error => {
        isDevMode() && console.error(error);
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

    this.saveToStorage();
  }

  setStartDate(value: string) {
    const time: { hours: number; minutes: number } = convertTime(value);

    if (time.hours > 2 && time.hours < 20) {
      this.isBedtimeStartCorrect = false;
    } else {
      this.isBedtimeStartCorrect = true;
      this.bedtimeMode.startAt.hours = time.hours;
      this.bedtimeMode.startAt.minutes = time.minutes;
      this.saveToStorage();
    }
  }

  setEndDate(value: string) {
    const time: { hours: number; minutes: number } = convertTime(value);

    if (time.hours >= 2 && time.hours <= 10) {
      this.isBedtimeEndCorrect = true;
      this.bedtimeMode.endAt.hours = time.hours;
      this.bedtimeMode.endAt.minutes = time.minutes;
      this.saveToStorage();
    } else {
      this.isBedtimeEndCorrect = false;
    }
  }

  timeToString(time: { hours: number; minutes: number }): string {
    return String(time.hours).padStart(2, "0") + ":" + String(time.minutes).padStart(2, "0");
  }

  private async saveToStorage() {
    await chrome.storage.sync
      .set({
        bedtimeMode: this.bedtimeMode,
      })
      .then(() => {
        isDevMode() && console.info("Bedtime mode preferences successfully saved ✅");
      });
  }

  private getDefaultConfig(): BedtimeMode {
    return {
      isEnabled: false,
      startAt: { hours: 23, minutes: 0 },
      endAt: { hours: 7, minutes: 0 },
    };
  }
}
