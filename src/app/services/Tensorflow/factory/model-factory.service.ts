import { Injectable, WritableSignal, effect, isDevMode, signal } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { SequentialModel } from "app/types/tensorflow";

@Injectable({
  providedIn: "root",
})
export class ModelFactoryService {
  factoryProgress: WritableSignal<number> = signal(0);
  private bypasslocalstorage = true;

  constructor() {
    effect(() => {
      console.log(this.factoryProgress + "%");
    });
  }

  async getModelInstanceOf(name: string): Promise<tf.Sequential> {
    return (await this.loadModel(name)) || this.trainModel(name);
  }

  async getClassInstanceOf(name: string): Promise<SequentialModel> {
    return await this.importModelClass(name);
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
      isDevMode() && console.error(error);
      throw new Error(`Impossible to instanciate the following class: ${name}`);
    }
  }

  private async loadModel(name: string): Promise<tf.Sequential | undefined> {
    if (isDevMode() && this.bypasslocalstorage) return undefined;

    try {
      const model = (await tf.loadLayersModel("localstorage://" + name)) as tf.Sequential;
      this.factoryProgress.set(100);
      isDevMode() && console.log("Model found in local storage ✅");
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
