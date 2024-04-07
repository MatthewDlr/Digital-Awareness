import { Injectable, WritableSignal, isDevMode, signal } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { TfModel } from "app/types/tensorflow";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  trainingProgress: WritableSignal<number> = signal(0);

  async initialize(model: TfModel): Promise<tf.Sequential> {
    console.info("Now training on-device model, please hold on a bit ...");

    const trainingModel: tf.Sequential = model.getLayers();
    await this.trainModel(trainingModel, model);
    this.logModelPerformances(trainingModel);
    this.saveModel(trainingModel, model);

    return trainingModel;
  }

  private async trainModel(model: tf.Sequential, modelData: TfModel): Promise<tf.History> {
    const featuresTensor = modelData.getFeaturesTensor();
    const labelsTensor = this.normalizeTensor(modelData.getLabelsTensor());
    const step = 100 / modelData.epoch;

    return await model.fit(featuresTensor, labelsTensor, {
      epochs: modelData.epoch,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress.update(value => value + step);
          isDevMode() && console.log("Progression: " + this.trainingProgress + "% Loss: " + logs?.["loss"]);
        },
      },
    });
  }

  private normalizeTensor(data: tf.Tensor1D): tf.Tensor1D {
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

  private saveModel(model: tf.Sequential, modelData: TfModel) {
    model.save("localstorage://" + modelData.name).then(() => {
      isDevMode() && console.info("Model saved in local storage ✅");
    });
  }
}
