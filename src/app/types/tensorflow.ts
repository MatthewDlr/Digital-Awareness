import * as tf from "@tensorflow/tfjs";
import { Signal, WritableSignal, isDevMode, signal } from "@angular/core";

export type Inference {
  model: tf.Sequential
  predcit(): any
}

export abstract class ModelInference {
  protected abstract name: string;
  protected abstract model: tf.Sequential;
  trainingProgress: Signal<number> = signal(0);

  predict(input: TfInput): number {
    if (!this.isModelReady) {
      isDevMode() && console.error("Model is not ready yet");
      return -1;
    }

    const inputTensor: tf.Tensor = tf.tensor2d(
      [this.model.normalizeInput(input.minutes), ...this.training.encodeCategory(input.category)],
      [1, 9],
    );

    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const result = this.deNormalizeOutput(prediction.dataSync()[0]);
    isDevMode() && console.log("Input: " + JSON.stringify(input) + " Prediction: " + result);
    return Math.round(result);
  }

  isModelReady() {
    return this.trainingProgress() === 100 ? true : false;
  }

  deNormalizeNumber(value: number, min: number, max: number): number {
    return value * (max - min) + min;
  }
}

export abstract class SequentialModel {
  public trainingProgress: WritableSignal<number> = signal(0);
  protected model: tf.Sequential;

  protected abstract trainingData: { input: any; output: number }[];
  protected abstract epoch: number;
  protected abstract createModel(): tf.Sequential;
  protected abstract getFeaturesTensor(): tf.Tensor;
  protected abstract getLabelsTensor(): tf.Tensor;
  abstract getInferenceParams() : any

  constructor() {
    this.model = this.createModel();
  }

  async train(): Promise<tf.Sequential> {
    console.info("Now training on-device model, please wait ...");
    const featuresTensor = this.getFeaturesTensor();
    const labelsTensor = this.getLabelsTensor();
    const step = 100 / this.epoch;

    await this.model.fit(featuresTensor, labelsTensor, {
      epochs: this.epoch,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress.update(value => value + step);
          isDevMode() && console.log("Gen: " + epoch + " Loss: " + logs?.["loss"]);
        },
        onTrainEnd: logs => {
          console.info("Model trained successfuly ✅");

          if (isDevMode()) {
            console.info(logs);
            const [unit, bias] = this.model.getWeights();
            console.info("Model stats: " + unit.dataSync()[0] + " bias: " + bias.dataSync()[0]);
          }
        },
      },
    });

    return this.model;
  }

  protected normalizeNumber(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  protected normalizeTensor(data: tf.Tensor): tf.Tensor {
    const min = tf.min(data);
    const max = tf.max(data);
    const range = max.sub(min);
    return data.sub(min).div(range);
  }
}
