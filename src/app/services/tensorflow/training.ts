import { Injectable } from "@angular/core";
import { Category } from "app/types/category";
import { TfTrainingData } from "app/types/tensorflow";

const categoryIndex = {
  [Category.unknown]: 0,
  [Category.streaming]: 1,
  [Category.news]: 2,
  [Category.social]: 3,
  [Category.shopping]: 4,
  [Category.music]: 5,
  [Category.games]: 6,
  [Category.gambling]: 7,
  [Category.services]: 8,
};

@Injectable({
  providedIn: "root",
})
export class training {
  data: TfTrainingData[] = [
    // Category unknown - Default timing function
    { input: { minutes: 0, category: Category.unknown }, output: 200 },
    { input: { minutes: 10, category: Category.unknown }, output: 200 },
    { input: { minutes: 20, category: Category.unknown }, output: 195 },
    { input: { minutes: 40, category: Category.unknown }, output: 190 },
    { input: { minutes: 60, category: Category.unknown }, output: 185 },
    { input: { minutes: 90, category: Category.unknown }, output: 180 },
    { input: { minutes: 120, category: Category.unknown }, output: 175 },
    { input: { minutes: 240, category: Category.unknown }, output: 170 },
    { input: { minutes: 360, category: Category.unknown }, output: 165 }, // 6 hours
    { input: { minutes: 1440, category: Category.unknown }, output: 120 }, // 1 day
    { input: { minutes: 2880, category: Category.unknown }, output: 100 }, // 2 days
    { input: { minutes: 4320, category: Category.unknown }, output: 60 }, // 3 days
    { input: { minutes: 5760, category: Category.unknown }, output: 50 }, // 4 days
    { input: { minutes: 7200, category: Category.unknown }, output: 40 }, // 5 days
    { input: { minutes: 8640, category: Category.unknown }, output: 30 }, // 6 days
    { input: { minutes: 10080, category: Category.unknown }, output: 10 }, // 7 days

    // Category streaming - More aggressive for shorter times
    { input: { minutes: 0, category: Category.streaming }, output: 200 },
    { input: { minutes: 10, category: Category.streaming }, output: 200 },
    { input: { minutes: 30, category: Category.streaming }, output: 195 },
    { input: { minutes: 60, category: Category.streaming }, output: 190 },
    { input: { minutes: 120, category: Category.streaming }, output: 185 }, // 2 hours
    { input: { minutes: 240, category: Category.streaming }, output: 180 }, // 4 hours
    { input: { minutes: 360, category: Category.streaming }, output: 175 }, // 6 hours
    { input: { minutes: 1440, category: Category.streaming }, output: 120 }, // 1 day
    { input: { minutes: 2880, category: Category.streaming }, output: 90 }, // 2 days
    { input: { minutes: 4320, category: Category.streaming }, output: 50 }, // 3 days
    { input: { minutes: 5760, category: Category.streaming }, output: 45 }, // 4 days
    { input: { minutes: 7200, category: Category.streaming }, output: 40 }, // 5 days
    { input: { minutes: 8640, category: Category.streaming }, output: 30 }, // 6 days
    { input: { minutes: 10080, category: Category.streaming }, output: 10 }, // 7 days

    // Category news - Less aggressive for shorter times
    { input: { minutes: 0, category: Category.news }, output: 200 },
    { input: { minutes: 10, category: Category.news }, output: 200 },
    { input: { minutes: 30, category: Category.news }, output: 190 },
    { input: { minutes: 60, category: Category.news }, output: 180 },
    { input: { minutes: 120, category: Category.news }, output: 160 },
    { input: { minutes: 240, category: Category.news }, output: 140 }, // 4 hours
    { input: { minutes: 360, category: Category.news }, output: 120 }, // 6 hours
    { input: { minutes: 1440, category: Category.news }, output: 60 }, // 1 day
    { input: { minutes: 2880, category: Category.news }, output: 55 }, // 2 days
    { input: { minutes: 4320, category: Category.news }, output: 50 }, // 3 days
    { input: { minutes: 5760, category: Category.news }, output: 40 }, // 4 days
    { input: { minutes: 7200, category: Category.news }, output: 30 }, // 5 days
    { input: { minutes: 8640, category: Category.news }, output: 20 }, // 6 days
    { input: { minutes: 10080, category: Category.news }, output: 15 }, // 7 days

    // Category social - More aggressive for shorter times
    { input: { minutes: 0, category: Category.social }, output: 200 },
    { input: { minutes: 10, category: Category.social }, output: 200 },
    { input: { minutes: 30, category: Category.social }, output: 195 },
    { input: { minutes: 60, category: Category.social }, output: 190 },
    { input: { minutes: 120, category: Category.social }, output: 180 },
    { input: { minutes: 240, category: Category.social }, output: 130 }, // 4 hours
    { input: { minutes: 360, category: Category.social }, output: 90 }, // 6 hours
    { input: { minutes: 1440, category: Category.social }, output: 60 }, // 1 day
    { input: { minutes: 2880, category: Category.social }, output: 55 }, // 2 days
    { input: { minutes: 4320, category: Category.social }, output: 50 }, // 3 days
    { input: { minutes: 5760, category: Category.social }, output: 40 }, // 4 days
    { input: { minutes: 7200, category: Category.social }, output: 30 }, // 5 days
    { input: { minutes: 8640, category: Category.social }, output: 25 }, // 6 days
    { input: { minutes: 10080, category: Category.social }, output: 15 }, // 7 days

    // Category shopping - More aggressive for shorter times
    { input: { minutes: 0, category: Category.shopping }, output: 200 },
    { input: { minutes: 10, category: Category.shopping }, output: 200 },
    { input: { minutes: 30, category: Category.shopping }, output: 190 },
    { input: { minutes: 60, category: Category.shopping }, output: 180 },
    { input: { minutes: 120, category: Category.shopping }, output: 170 },
    { input: { minutes: 240, category: Category.shopping }, output: 160 }, // 4 hours
    { input: { minutes: 360, category: Category.shopping }, output: 150 }, // 6 hours
    { input: { minutes: 1440, category: Category.shopping }, output: 140 }, // 1 day
    { input: { minutes: 2880, category: Category.shopping }, output: 120 }, // 2 days
    { input: { minutes: 4320, category: Category.shopping }, output: 100 }, // 3 days
    { input: { minutes: 5760, category: Category.shopping }, output: 80 }, // 4 days
    { input: { minutes: 7200, category: Category.shopping }, output: 60 }, // 5 days
    { input: { minutes: 8640, category: Category.shopping }, output: 40 }, // 6 days
    { input: { minutes: 10080, category: Category.shopping }, output: 30 }, // 7 days
  ];

  minMinutes = Math.min(...this.data.map(data => data.input.minutes));
  maxMinutes = Math.max(...this.data.map(data => data.input.minutes));
  minOutput = Math.min(...this.data.map(data => data.output));
  maxOutput = Math.max(...this.data.map(data => data.output));

  getFeatures(): number[][] {
    const features: number[][] = [];
    this.data.forEach(data => {
      features.push([this.normalizeInput(data.input.minutes), ...this.encodeCategory(data.input.category)]);
    });
    return features;
  }

  getLabels(): number[] {
    return this.data.map(data => {
      return data.output;
    });
  }

  encodeCategory(category: Category): number[] {
    const result = new Array(8).fill(0);
    result[categoryIndex[category]] = 1;
    return result;
  }

  normalizeInput(value: number): number {
    return (value - this.minMinutes) / (this.maxMinutes - this.minMinutes);
  }
}
