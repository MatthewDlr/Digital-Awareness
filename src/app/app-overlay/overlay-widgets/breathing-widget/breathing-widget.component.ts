import { Component, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AwarenessPageComponent } from "../../awareness-page/awareness-page.component";

@Component({
    selector: "app-breathing-widget",
    imports: [CommonModule, AwarenessPageComponent],
    templateUrl: "./breathing-widget.component.html",
    styleUrl: "./breathing-widget.component.css"
})
export class BreathingWidgetComponent {
  text = "Get Ready";
  timerValue!: number;

  constructor(private awarenessPageComponent: AwarenessPageComponent) {
    // Getting timer value from the awareness page
    effect(() => {
      this.timerValue = awarenessPageComponent.timerValue();
    });

    setTimeout(() => {
      this.breathe();
    }, 3000);
  }

  async breathe() {
    this.text = "Inhale";
    await this.delay(3000);
    this.text = "Hold";
    await this.delay(2000);
    this.text = "Exhale";
    await this.delay(3000);

    if (this.timerValue >= 5) {
      this.text = "Hold";
      await this.delay(2000);
      this.breathe();
    } else {
      this.text = "Done";
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
