import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoomScrollingComponent } from "./doom-scrolling/doom-scrolling.component";
import { BedtimeModeComponent } from "./bedtime-mode/bedtime-mode.component";

@Component({
    selector: "app-disconnect",
    imports: [CommonModule, DoomScrollingComponent, BedtimeModeComponent],
    templateUrl: "./disconnect.component.html",
    styleUrls: ["./disconnect.component.css"]
})
export class DisconnectComponent {}
