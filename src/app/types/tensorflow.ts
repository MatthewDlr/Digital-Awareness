import * as tf from "@tensorflow/tfjs";

export interface TfModel {
  name: string;
  trainingData: { input: any; output: number }[];
  epoch: number;
  getLayers(): tf.Sequential;
  getFeaturesTensor(): tf.Tensor;
  getLabelsTensor(): tf.Tensor1D;
}
