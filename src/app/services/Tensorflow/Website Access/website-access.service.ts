import { Injectable } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { ModelFactoryService } from "../factory/model-factory.service";
import { ModelInference } from "app/types/tensorflow";

@Injectable({
  providedIn: "root",
})
export class WebsiteAccessService extends ModelInference {
  name: string = "WebsiteAccess";
  model!: tf.Sequential;

  constructor() {
    super();

    const modelFactory = new ModelFactoryService();
    this.trainingProgress = modelFactory.factoryProgress;
    modelFactory.getInstanceOf(this.name).then(model => {
      this.model = model;
      console.log("SUCCESS!");
    });
  }
}
