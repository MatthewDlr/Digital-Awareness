import { Injectable } from "@angular/core";
import { Category } from "app/types/types";

export interface Input {
  minutesSinceLastAccess: number;
  category: Category;
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
    // Category unknown - Default timing function
    { input: { minutesSinceLastAccess: 10, category: Category.unknown }, output: 200 },
    { input: { minutesSinceLastAccess: 20, category: Category.unknown }, output: 195 },
    { input: { minutesSinceLastAccess: 40, category: Category.unknown }, output: 190 },
    { input: { minutesSinceLastAccess: 60, category: Category.unknown }, output: 185 },
    { input: { minutesSinceLastAccess: 90, category: Category.unknown }, output: 180 },
    { input: { minutesSinceLastAccess: 120, category: Category.unknown }, output: 175 },
    { input: { minutesSinceLastAccess: 240, category: Category.unknown }, output: 170 },
    { input: { minutesSinceLastAccess: 360, category: Category.unknown }, output: 165 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440, category: Category.unknown }, output: 120 }, // 1 day
    { input: { minutesSinceLastAccess: 2880, category: Category.unknown }, output: 100 }, // 2 days
    { input: { minutesSinceLastAccess: 4320, category: Category.unknown }, output: 60 }, // 3 days
    { input: { minutesSinceLastAccess: 5760, category: Category.unknown }, output: 50 }, // 4 days
    { input: { minutesSinceLastAccess: 7200, category: Category.unknown }, output: 40 }, // 5 days
    { input: { minutesSinceLastAccess: 8640, category: Category.unknown }, output: 30 }, // 6 days
    { input: { minutesSinceLastAccess: 10080, category: Category.unknown }, output: 15 }, // 7 days

    // Category streaming - More aggressive for shorter times
    { input: { minutesSinceLastAccess: 10, category: Category.streaming }, output: 200 },
    { input: { minutesSinceLastAccess: 30, category: Category.streaming }, output: 195 },
    { input: { minutesSinceLastAccess: 60, category: Category.streaming }, output: 190 },
    { input: { minutesSinceLastAccess: 120, category: Category.streaming }, output: 185 }, // 2 hours
    { input: { minutesSinceLastAccess: 240, category: Category.streaming }, output: 180 }, // 4 hours
    { input: { minutesSinceLastAccess: 360, category: Category.streaming }, output: 175 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440, category: Category.streaming }, output: 120 }, // 1 day
    { input: { minutesSinceLastAccess: 2880, category: Category.streaming }, output: 90 }, // 2 days
    { input: { minutesSinceLastAccess: 4320, category: Category.streaming }, output: 50 }, // 3 days
    { input: { minutesSinceLastAccess: 5760, category: Category.streaming }, output: 45 }, // 4 days
    { input: { minutesSinceLastAccess: 7200, category: Category.streaming }, output: 40 }, // 5 days
    { input: { minutesSinceLastAccess: 8640, category: Category.streaming }, output: 30 }, // 6 days
    { input: { minutesSinceLastAccess: 10080, category: Category.streaming }, output: 15 }, // 7 days

    // Category news - Less aggressive for shorter times
    { input: { minutesSinceLastAccess: 10, category: Category.news }, output: 200 },
    { input: { minutesSinceLastAccess: 30, category: Category.news }, output: 190 },
    { input: { minutesSinceLastAccess: 60, category: Category.news }, output: 180 },
    { input: { minutesSinceLastAccess: 120, category: Category.news }, output: 160 },
    { input: { minutesSinceLastAccess: 240, category: Category.news }, output: 140 }, // 4 hours
    { input: { minutesSinceLastAccess: 360, category: Category.news }, output: 120 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440, category: Category.news }, output: 60 }, // 1 day
    { input: { minutesSinceLastAccess: 2880, category: Category.news }, output: 60 }, // 2 days
    { input: { minutesSinceLastAccess: 4320, category: Category.news }, output: 50 }, // 3 days
    { input: { minutesSinceLastAccess: 5760, category: Category.news }, output: 40 }, // 4 days
    { input: { minutesSinceLastAccess: 7200, category: Category.news }, output: 30 }, // 5 days
    { input: { minutesSinceLastAccess: 8640, category: Category.news }, output: 20 }, // 6 days
    { input: { minutesSinceLastAccess: 10080, category: Category.news }, output: 15 }, // 7 days

    // Category social - More aggressive for shorter times
    { input: { minutesSinceLastAccess: 10, category: Category.social }, output: 200 },
    { input: { minutesSinceLastAccess: 30, category: Category.social }, output: 195 },
    { input: { minutesSinceLastAccess: 60, category: Category.social }, output: 190 },
    { input: { minutesSinceLastAccess: 120, category: Category.social }, output: 180 },
    { input: { minutesSinceLastAccess: 240, category: Category.social }, output: 130 }, // 4 hours
    { input: { minutesSinceLastAccess: 360, category: Category.social }, output: 80 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440, category: Category.social }, output: 60 }, // 1 day
    { input: { minutesSinceLastAccess: 2880, category: Category.social }, output: 60 }, // 2 days
    { input: { minutesSinceLastAccess: 4320, category: Category.social }, output: 50 }, // 3 days
    { input: { minutesSinceLastAccess: 5760, category: Category.social }, output: 40 }, // 4 days
    { input: { minutesSinceLastAccess: 7200, category: Category.social }, output: 30 }, // 5 days
    { input: { minutesSinceLastAccess: 8640, category: Category.social }, output: 25 }, // 6 days
    { input: { minutesSinceLastAccess: 10080, category: Category.social }, output: 20 }, // 7 days

    // Category shopping - More aggressive for shorter times
    { input: { minutesSinceLastAccess: 10, category: Category.shopping }, output: 200 },
    { input: { minutesSinceLastAccess: 30, category: Category.shopping }, output: 190 },
    { input: { minutesSinceLastAccess: 60, category: Category.shopping }, output: 180 },
    { input: { minutesSinceLastAccess: 120, category: Category.shopping }, output: 170 },
    { input: { minutesSinceLastAccess: 240, category: Category.shopping }, output: 160 }, // 4 hours
    { input: { minutesSinceLastAccess: 360, category: Category.shopping }, output: 150 }, // 6 hours
    { input: { minutesSinceLastAccess: 1440, category: Category.shopping }, output: 140 }, // 1 day
    { input: { minutesSinceLastAccess: 2880, category: Category.shopping }, output: 120 }, // 2 days
    { input: { minutesSinceLastAccess: 4320, category: Category.shopping }, output: 100 }, // 3 days
    { input: { minutesSinceLastAccess: 5760, category: Category.shopping }, output: 80 }, // 4 days
    { input: { minutesSinceLastAccess: 7200, category: Category.shopping }, output: 60 }, // 5 days
    { input: { minutesSinceLastAccess: 8640, category: Category.shopping }, output: 40 }, // 6 days
    { input: { minutesSinceLastAccess: 10080, category: Category.shopping }, output: 30 }, // 7 days
  ];

  getData() {
    const data = this.data.map(data => ({
      minutes: data.input.minutesSinceLastAccess,
      category: data.input.category.toString().toLowerCase(),
      output: data.output,
    }));
    console.log(data);
    return data;
  }

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
