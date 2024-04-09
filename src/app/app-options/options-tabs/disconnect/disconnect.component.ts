import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoomScrollingComponent } from "./doom-scrolling/doom-scrolling.component";
import { BedtimeModeComponent } from "./bedtime-mode/bedtime-mode.component";

@Component({
  selector: "app-disconnect",
  standalone: true,
  imports: [CommonModule, DoomScrollingComponent, BedtimeModeComponent],
  templateUrl: "./disconnect.component.html",
  styleUrls: ["./disconnect.component.css"],
})
export class DisconnectComponent {
  timeToNumber(time: string): { hours: number; min: number } {
    const timeStr = time.split(":");
    return { hours: Number(timeStr[0]), min: Number(timeStr[1]) };
  }
}
