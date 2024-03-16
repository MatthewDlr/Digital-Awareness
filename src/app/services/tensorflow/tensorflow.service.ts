import { Injectable } from "@angular/core";
import * as tf from "@tensorflow/tfjs";

interface Feature {
  minutesSinceLastAccess: number;
}

interface TrainingData {
  feature: Feature;
  answer: number;
}

@Injectable({
  providedIn: "root",
})
export class TensorflowService {
  private trainingData: TrainingData[] = [
    { feature: { minutesSinceLastAccess: 10 }, answer: 200 },
    { feature: { minutesSinceLastAccess: 20 }, answer: 195 },
    { feature: { minutesSinceLastAccess: 40 }, answer: 190 },
    { feature: { minutesSinceLastAccess: 60 }, answer: 185 },
    { feature: { minutesSinceLastAccess: 90 }, answer: 180 },
    { feature: { minutesSinceLastAccess: 120 }, answer: 175 },
    { feature: { minutesSinceLastAccess: 240 }, answer: 170 },
    { feature: { minutesSinceLastAccess: 360 }, answer: 165 }, // 6 hours
    { feature: { minutesSinceLastAccess: 1440 }, answer: 120 }, // 1 day
    { feature: { minutesSinceLastAccess: 2880 }, answer: 100 }, // 2 days
    { feature: { minutesSinceLastAccess: 4320 }, answer: 60 }, // 3 days
    { feature: { minutesSinceLastAccess: 5760 }, answer: 50 }, // 4 days
    { feature: { minutesSinceLastAccess: 7200 }, answer: 40 }, // 5 days
    { feature: { minutesSinceLastAccess: 8640 }, answer: 30 }, // 6 days
    { feature: { minutesSinceLastAccess: 10080 }, answer: 15 }, // 7 days
  ];

  features = this.normalize(tf.tensor1d(this.trainingData.map(data => data.feature.minutesSinceLastAccess)));
  labels = this.normalize(tf.tensor1d(this.trainingData.map(data => data.answer)));

  constructor() {
    this.initialize();
  }

  async initialize() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));

    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.06) });
    await this.trainModel(model);
    const [unit, bias] = model.getWeights();
    console.log("unit: " + unit.dataSync()[0] + " bias: " + bias.dataSync()[0]);

    const number = this.normalizeNumber(9531);
    const prediction = model.predict(tf.tensor1d([number])) as tf.Tensor;
    const result = this.deNormalizeNumber(prediction.dataSync()[0]);
    console.log("Prediction: " + result);
  }

  private async trainModel(model: tf.Sequential) {
    return await model.fit(this.features, this.labels, {
      epochs: 200,
      callbacks: { onEpochEnd: (epoch, logs) => console.log("Gen: " + epoch + " Loss: " + logs?.["loss"]) },
    });
  }

  deNormalizeNumber(value: number): number {
    const min = 15;
    const max = 200;
    return value * (max - min) + min;
  }

  normalizeNumber(value: number): number {
    const min = 10;
    const max = 10080;
    return (value - min) / (max - min);
  }

  normalize(data: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> {
    const min = tf.min(data);
    const max = tf.max(data);
    const range = max.sub(min);
    return data.sub(min).div(range);
  }
}
