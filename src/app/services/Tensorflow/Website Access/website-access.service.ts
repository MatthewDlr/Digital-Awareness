import { Injectable, effect, isDevMode } from "@angular/core";
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

    effect(() => {
      console.log(this.trainingProgress() + "%");
    });

    this.trainingProgress = this.modelFactory.factoryProgress;
    this.modelFactory.getModelInstanceOf(this.name).then(model => {
      this.model = model;
      console.log("SUCCESS!");
    });
  }

  async predict(input: WebsiteAccessInput) {
    const websiteAccess = await this.modelFactory.getClassInstanceOf(this.name);
    const inputTensor: tf.Tensor = websiteAccess.createInputTensor(input);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;

    const result = websiteAccess.deNormalizePrediction(prediction.dataSync()[0]);
    isDevMode() && console.log("Input: " + JSON.stringify(input) + " Prediction: " + result);
    return Math.round(result);
  }
}
