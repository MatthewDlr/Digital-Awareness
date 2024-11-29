import { isDevMode, signal } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { BehaviorSubject } from "rxjs";

export abstract class ModelInference {
  protected abstract name: string;
  protected model!: tf.Sequential;
  trainingProgress = signal<number>(0);
  protected inputType: any;

  abstract predict(input: any): any;
}

export abstract class SequentialModel {
  public trainingProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  protected model: tf.Sequential;

  protected abstract trainingData: { input: any; output: number }[];
  protected abstract epoch: number;
  protected abstract createModel(): tf.Sequential;
  protected abstract getFeaturesTensor(): tf.Tensor;
  protected abstract getLabelsTensor(): tf.Tensor;
  abstract createInputTensor(input: any): any;
  abstract deNormalizePrediction(input: any): any;

  constructor() {
    this.model = this.createModel();
  }

  async train(): Promise<tf.Sequential> {
    console.info("Now training on-device model, please wait ...");
    const featuresTensor = this.getFeaturesTensor();
    const labelsTensor = this.getLabelsTensor();
    const step = 95 / this.epoch;

    await this.model.fit(featuresTensor, labelsTensor, {
      epochs: this.epoch,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress.next(this.trainingProgress.getValue() + step);
          isDevMode() && console.log("Gen: " + epoch + " Loss: " + logs?.["loss"]);
        },
        onTrainEnd: () => {
          console.info("Model trained successfuly ✅");

          if (isDevMode()) {
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
