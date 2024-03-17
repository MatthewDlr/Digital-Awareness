import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { training, Input } from "./training";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TensorflowService {
  model = this.createModel();

  constructor(private training: training) {
    this.initialize().then(() => {
      this.predict({ minutesSinceLastAccess: 4000 });
    });
  }

  inputs = this.normalize(tf.tensor1d(this.training.data.map(data => data.input.minutesSinceLastAccess)));
  outputs = this.normalize(tf.tensor1d(this.training.data.map(data => data.output)));
  isModelReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  predict(input: Input): number {
    if (!this.isModelReady.value) {
      isDevMode() && console.error("Model is not ready yet");
      return -1;
    }

    const minutesSinceLastAccess = this.training.normalizeInput(input.minutesSinceLastAccess);
    const prediction = this.model.predict(tf.tensor1d([minutesSinceLastAccess])) as tf.Tensor;
    const result = Math.round(this.training.deNormalizeOutput(prediction.dataSync()[0]));
    isDevMode() && console.log("Input: " + JSON.stringify(input) + " Prediction: " + result);
    return result;
  }

  async initialize() {
    await this.trainmodel();
    const [unit, bias] = this.model.getWeights();
    console.log("unit: " + unit.dataSync()[0] + " bias: " + bias.dataSync()[0]);
    this.isModelReady.next(true);
  }

  private createModel(): tf.Sequential {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.06) });

    return model;
  }

  private async trainmodel() {
    return await this.model.fit(this.inputs, this.outputs, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          isDevMode() && console.log("Gen: " + epoch + " Loss: " + logs?.["loss"]);
        },
      },
    });
  }

  private normalize(data: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> {
    const min = tf.min(data);
    const max = tf.max(data);
    const range = max.sub(min);
    return data.sub(min).div(range);
  }
}
