import { Injectable } from "@angular/core";

export interface Input {
  minutesSinceLastAccess: number;
}

interface TrainingData {
  input: Input;
  output: number;
}

@Injectable({
  providedIn: "root",
})
export class training {
  data: TrainingData[] = [
    { input: { minutesSinceLastAccess: 10 }, output: 200 },
    { input: { minutesSinceLastAccess: 20 }, output: 195 },
    { input: { minutesSinceLastAccess: 40 }, output: 190 },
    { input: { minutesSinceLastAccess: 60 }, output: 185 },
    { input: { minutesSinceLastAccess: 90 }, output: 180 },
    { input: { minutesSinceLastAccess: 120 }, output: 175 },
    { input: { minutesSinceLastAccess: 240 }, output: 170 },
    { input: { minutesSinceLastAccess: 360 }, output: 165 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440 }, output: 120 }, // 1 day
    { input: { minutesSinceLastAccess: 2880 }, output: 100 }, // 2 days
    { input: { minutesSinceLastAccess: 4320 }, output: 60 }, // 3 days
    { input: { minutesSinceLastAccess: 5760 }, output: 50 }, // 4 days
    { input: { minutesSinceLastAccess: 7200 }, output: 40 }, // 5 days
    { input: { minutesSinceLastAccess: 8640 }, output: 30 }, // 6 days
    { input: { minutesSinceLastAccess: 10080 }, output: 15 }, // 7 days
  ];

  getInputMax(): number {
    return Math.max(...this.data.map(data => data.input.minutesSinceLastAccess));
  }

  getInputMin(): number {
    return Math.min(...this.data.map(data => data.input.minutesSinceLastAccess));
  }

  normalizeInput(value: number): number {
    const min = this.getInputMin();
    const max = this.getInputMax();
    return (value - min) / (max - min);
  }

  getOutputMax(): number {
    return Math.max(...this.data.map(data => data.output));
  }

  getOutputMin(): number {
    return Math.min(...this.data.map(data => data.output));
  }

  deNormalizeOutput(value: number): number {
    const min = this.getOutputMin();
    const max = this.getOutputMax();
    return value * (max - min) + min;
  }
}
