import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { ModelInference } from "app/types/tensorflow.type";
import { WebsiteAccessInput } from "../models/WebsiteAccess.model";

@Injectable({
  providedIn: "root",
})
export class WebsiteAccessService extends ModelInference {
  name = "WebsiteAccess";

  constructor() {
    super();

    this.modelFactory.factoryProgress.subscribe((value: number) => {
      this.trainingProgress.next(value);
    });
    this.modelFactory.getModelInstanceOf(this.name).then((model: tf.Sequential) => {
      this.model = model;
    });
  }

  async predict(input: WebsiteAccessInput): Promise<number> {
    if (this.trainingProgress.getValue() < 100) {
      console.error("Model is not ready yet");
      return -1;
    }

    const websiteAccessClass = await this.modelFactory.getClassInstanceOf(this.name);
    const inputTensor: tf.Tensor = websiteAccessClass.createInputTensor(input);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;

    const result = websiteAccessClass.deNormalizePrediction(prediction.dataSync()[0]);
    isDevMode() && console.log("Input: " + JSON.stringify(input) + " Prediction: " + result);
    return Math.round(result);
  }
}
