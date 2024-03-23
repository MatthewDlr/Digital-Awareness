import { Category } from "./category";

export type WatchedWebsite = {
  host: string;
  allowedUntil: string;
  allowedAt: string;
  category: Category;
};
