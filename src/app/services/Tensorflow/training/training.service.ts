import { Injectable, OnInit, WritableSignal, isDevMode, signal } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { getFeatures, getLabels, getModel } from "./data";

const EPOCH = 100;
const MODEL_NAME = "digital-awareness-SelfSense";

@Injectable({
  providedIn: "root",
})
export class TrainingService implements OnInit {
  trainingProgress: WritableSignal<number> = signal(0);

  async ngOnInit(): Promise<tf.Sequential> {
    console.info("Now training on-device model, please hold on a bit ...");

    const model: tf.Sequential = getModel();
    await this.trainModel(model);
    this.logModelPerformances(model);
    this.saveModel(model);

    return model;
  }

  private async trainModel(model: tf.Sequential): Promise<tf.History> {
    const featuresTensor = tf.tensor2d(getFeatures());
    const labelsTensor = this.normalizeTensor(tf.tensor1d(getLabels()));
    const step = 100 / EPOCH;

    return await model.fit(featuresTensor, labelsTensor, {
      epochs: EPOCH,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress.update(value => value + step);
          isDevMode() && console.log("Progression: " + this.trainingProgress + "% Loss: " + logs?.["loss"]);
        },
      },
    });
  }

  private normalizeTensor(data: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> {
    const min = tf.min(data);
    const max = tf.max(data);
    const range = max.sub(min);
    return data.sub(min).div(range);
  }

  private logModelPerformances(model: tf.Sequential): void {
    console.info("Model training successful");

    if (isDevMode()) {
      const [unit, bias] = model.getWeights();
      console.info("Model stats: " + unit.dataSync()[0] + " bias: " + bias.dataSync()[0]);
    }
  }

  private saveModel(model: tf.Sequential) {
    model.save("localstorage://" + MODEL_NAME).then(() => {
      isDevMode() && console.info("Model saved in local storage ✅");
    });
  }
}
