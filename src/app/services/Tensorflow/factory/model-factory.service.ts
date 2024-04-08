import { Injectable, WritableSignal, isDevMode, signal } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { SequentialModel } from "app/types/tensorflow";

@Injectable({
  providedIn: "root",
})
export class ModelFactoryService {
  factoryProgress: WritableSignal<number> = signal(0);

  constructor() {}

  async getInstanceOf(name: string): Promise<tf.Sequential> {
    return (await this.loadModel(name)) || this.trainModel(name);
  }

  async getInferenceParams(name: string): Promise<any> {
    const modelClass: SequentialModel = await this.importModelClass(name);
    return modelClass.getInferenceParams();
  }

  private async trainModel(name: string): Promise<tf.Sequential> {
    const modelClass: SequentialModel = await this.importModelClass(name);
    this.factoryProgress = modelClass.trainingProgress;
    const model: tf.Sequential = await modelClass.train();
    this.saveModel(model, name);
    return model;
  }

  private async importModelClass(name: string): Promise<SequentialModel> {
    try {
      const module = await import(`../models/${name}.model`);
      const ModelClass = module[name];
      return new ModelClass() as SequentialModel;
    } catch (error) {
      throw new Error(`No model found with the name: ${name}`);
    }
  }

  private async loadModel(name: string): Promise<tf.Sequential | undefined> {
    try {
      const model = (await tf.loadLayersModel("localstorage://" + name)) as tf.Sequential;
      this.factoryProgress.set(100);
      return model;
    } catch (error) {
      isDevMode() && console.log(error);
      return undefined;
    }
  }

  private async saveModel(model: tf.Sequential, name: string) {
    await model.save("localstorage://" + name).then(() => {
      isDevMode() && console.log("Model saved in local storage ✅");
    });
  }
}
