import { Category } from "./category";

export interface TfInput {
  minutes: number; // Minutes since last access
  category: Category; // Category of the website
}

export interface TfTrainingData {
  input: TfInput;
  output: number;
}
