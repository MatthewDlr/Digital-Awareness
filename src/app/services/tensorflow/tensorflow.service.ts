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

  constructor() {
    this.initialize();
  }

  initialize() {
    const model = tf.sequential({
      layers: [tf.layers.dense({ inputShape: [1], units: 32, activation: "relu" }), tf.layers.dense({ units: 1 })],
    });

    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    const features = this.normalize(tf.tensor(this.trainingData.map(data => data.feature.minutesSinceLastAccess)));

    const labels = tf.tensor(this.trainingData.map(data => data.answer as number));

    model.fit(features, labels, { epochs: 10 }).then(() => {
      console.log("model is trained");
      const prediction = model.predict(tf.tensor([10]));

      console.log("Prediction: ", prediction.toString());
    });
  }

  normalize(data: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> {
    const min = tf.min(data); // Find minimum value
    const max = tf.max(data);
    const range = max.sub(min);
    return data.sub(min).div(range);
  }
}
