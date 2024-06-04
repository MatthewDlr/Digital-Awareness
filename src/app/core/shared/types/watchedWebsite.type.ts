import { Category } from "./category.type";

export type WatchedWebsite = {
  host: string;
  allowedUntil: string;
  allowedAt: string;
  category: Category;
};
