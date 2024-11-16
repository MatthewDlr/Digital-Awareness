import { Category } from "./category.type";

export interface RestrictedWebsite {
  host: string;
  allowedUntil: string;
  allowedAt: string;
  category: Category;
}
