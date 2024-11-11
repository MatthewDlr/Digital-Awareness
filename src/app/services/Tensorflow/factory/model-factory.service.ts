import { Injectable, isDevMode } from "@angular/core";
import * as tf from "@tensorflow/tfjs";
import { SequentialModel } from "app/types/tensorflow.type";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModelFactoryService {
  factoryProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private bypasslocalstorage = false; // Force the factory to rebuild the model every time. Value is ignored in production.


  async getModelInstanceOf(name: string): Promise<tf.Sequential> {
    const model = (await this.loadModel(name)) || (await this.trainModel(name));
    this.factoryProgress.next(100);
    return model;
  }

  async getClassInstanceOf(name: string): Promise<SequentialModel> {
    return await this.importModelClass(name);
  }

  private async trainModel(name: string): Promise<tf.Sequential> {
    const modelClass: SequentialModel = await this.getClassInstanceOf(name);
    modelClass.trainingProgress.subscribe(value => this.factoryProgress.next(value));
    const model: tf.Sequential = await modelClass.train();
    this.saveModel(model, name);
    return model;
  }

  private async importModelClass(name: string): Promise<SequentialModel> {
    try {
      const modulePath = `../models/${name}.model`;
      isDevMode() && console.log(`Attempting to import module: ${modulePath}`);
      const module = await import(modulePath);
      const ModelClass = module[name];
      return new ModelClass() as SequentialModel;
    } catch (error) {
      isDevMode() && console.error(`Error importing module: ${error}`);
      throw new Error(`Impossible to instantiate the following class: ${name}`);
    }
  }

  private async loadModel(name: string): Promise<tf.Sequential | undefined> {
    if (isDevMode() && this.bypasslocalstorage) return undefined;

    try {
      const model = (await tf.loadLayersModel("localstorage://" + name)) as tf.Sequential;
      isDevMode() && console.log("Model found in local storage ✅");
      return model;
    } catch (error) {
      isDevMode() && console.log(error);
      return undefined;
    }
  }

  private async saveModel(model: tf.Sequential, name: string) {
    await model.save("localstorage://" + name);
    isDevMode() && console.log("Model saved in local storage ✅");
  }
}
