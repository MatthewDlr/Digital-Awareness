import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { ModelInference } from "app/types/tensorflow";
import { WebsiteAccessInput } from "../models/WebsiteAccess.model";

@Injectable({
  providedIn: "root",
})
export class WebsiteAccessService extends ModelInference {
  name: string = "WebsiteAccess";

  constructor() {
    super();

    this.modelFactory.factoryProgress.subscribe(value => {
      this.trainingProgress.next(value);
    });
    this.modelFactory.getModelInstanceOf(this.name).then(model => {
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
