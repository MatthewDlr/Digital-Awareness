export type WatchedWebsite = {
  host: string;
  timer: number;
  allowedUntil: string;
  blockedAt: string;
  timesBlocked: number;
  timesAllowed: number;
  category: Category;
};

export enum Category {
  social = "Social",
  streaming = "Streaming",
  gambling = "Gambling",
  games = "Games",
  shopping = "Shopping",
  news = "News",
  music = "Music",
  unknown = "Unknown",
}
