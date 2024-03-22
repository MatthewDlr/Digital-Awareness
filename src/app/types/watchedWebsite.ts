import { Category } from "./category";

export type WatchedWebsite = {
  host: string;
  allowedUntil: string;
  blockedAt: string[];
  category: Category;
};