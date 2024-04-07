import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { training } from "../training/training";
import { BehaviorSubject } from "rxjs";
import { TfInput } from "app/types/tensorflow";

@Injectable({
  providedIn: "root",
})
export class InferenceService {
  model!: tf.Sequential;
  isModelReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private training: training) {
    this.modelFactory().then(model => {
      this.model = model;
      this.isModelReady.next(true);
    });
  }

  private async modelFactory(): Promise<tf.Sequential> {
    let model = (await this.loadModel()) as tf.Sequential;

    if (!model) {
      console.info("Now training on-device model, please hold on a bit ...");

      model = this.createModel();
      await this.trainModel(model);
      const [unit, bias] = model.getWeights();
      this.saveModel(model);

      isDevMode() && console.info("Model stats: " + unit.dataSync()[0] + " bias: " + bias.dataSync()[0]);
      console.info("Model training successful");
    } else {
      isDevMode() && console.log("Model loaded from localstorage");
    }
    return model;
  }

  predict(input: TfInput): number {
    if (!this.isModelReady.value) {
      isDevMode() && console.error("Model is not ready yet");
      return -1;
    }

    const inputTensor: tf.Tensor = tf.tensor2d(
      [this.training.normalizeInput(input.minutes), ...this.training.encodeCategory(input.category)],
      [1, 9],
    );

    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const result = this.deNormalizeOutput(prediction.dataSync()[0]);
    isDevMode() && console.log("Input: " + JSON.stringify(input) + " Prediction: " + result);
    return Math.round(result);
  }

  private createModel(): tf.Sequential {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [9], units: 64, activation: "relu" }));
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ loss: "meanSquaredError", optimizer: "adam" });

    return model;
  }

  private async trainModel(model: tf.Sequential): Promise<tf.History> {
    const featuresTensor = tf.tensor2d(this.training.getFeatures());
    const labelsTensor = this.normalize(tf.tensor1d(this.training.getLabels()));

    return await model.fit(featuresTensor, labelsTensor, {
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

  private async saveModel(model: tf.Sequential) {
    await model.save("localstorage://tensorflow-aware").then(() => {
      isDevMode() && console.log("Model saved in local storage ✅");
    });
  }

  private async loadModel(): Promise<tf.LayersModel | undefined> {
    try {
      return await tf.loadLayersModel("localstorage://tensorflow-aware");
    } catch (error) {
      isDevMode() && console.log(error);
      return undefined;
    }
  }

  private deNormalizeOutput(value: number): number {
    return value * (this.training.maxOutput - this.training.minOutput) + this.training.minMinutes;
  }
}
