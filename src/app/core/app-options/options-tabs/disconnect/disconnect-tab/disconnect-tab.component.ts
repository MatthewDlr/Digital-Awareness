import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoomScrollingComponent } from "../doom-scrolling/doom-scrolling.component";
import { BedtimeModeComponent } from "../bedtime-mode/bedtime-mode.component";

@Component({
  selector: "app-disconnect-tab",
  standalone: true,
  imports: [CommonModule, DoomScrollingComponent, BedtimeModeComponent],
  templateUrl: "./disconnect-tab.component.html",
  styleUrls: ["./disconnect-tab.component.css"],
})
export class DisconnectTabComponent {}
