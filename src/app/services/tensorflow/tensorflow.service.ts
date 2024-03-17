import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { training, Input } from "./training";
import { BehaviorSubject } from "rxjs";
import { Category } from "app/types/types";

@Injectable({
  providedIn: "root",
})
export class TensorflowService {
  model = this.createModel();

  constructor(private training: training) {
    this.initialize().then(() => {
      this.predict({ minutesSinceLastAccess: 2000, category: Category.social });
      this.predict({ minutesSinceLastAccess: 2000, category: Category.unknown });
      this.predict({ minutesSinceLastAccess: 2000, category: Category.streaming });
      this.predict({ minutesSinceLastAccess: 2000, category: Category.shopping });
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
    const categoryIndex = this.training.normalizeInput(Object.values(Category).indexOf(input.category));
    const prediction = this.model.predict(tf.tensor2d([[minutesSinceLastAccess, categoryIndex]])) as tf.Tensor;
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
    model.add(tf.layers.dense({ inputShape: [2], units: 128, activation: "relu" }));
    model.add(tf.layers.dense({ units: 64, activation: "relu" }));
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.1) });

    return model;
  }

  private async trainmodel(): Promise<tf.History> {
    const trainingData = this.training.getData();

    const categories = Array.from(new Set(trainingData.map(data => data.category)));
    const categoryIndices = trainingData.map(data => categories.indexOf(data.category));
    const categoryTensor = this.normalize(tf.tensor1d(categoryIndices));
    console.log(categoryTensor.shape);

    const minutesTensor = this.normalize(tf.tensor1d(trainingData.map(data => data.minutes)));
    console.log(minutesTensor.shape);
    const outputTensor = this.normalize(tf.tensor1d(trainingData.map(data => data.output)));

    const minutesTensor2D = minutesTensor.expandDims(1);
    const categoryTensor2D = categoryTensor.expandDims(1);

    const inputTensor = tf.concat([minutesTensor2D, categoryTensor2D], 1);

    return await this.model.fit([inputTensor], outputTensor, {
      epochs: 50,
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
