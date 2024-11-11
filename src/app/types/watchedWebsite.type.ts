import { Category } from "./category.type";

export interface WatchedWebsite {
  host: string;
  allowedUntil: string;
  allowedAt: string;
  category: Category;
}
