export type watchedWebsite = {
  host: string;
  timer: number;
  allowedUntil: string;
  blockedAt: string;
  timesBlocked: number;
  timesAllowed: number;
  category: category;
};

export enum category {
  social = "Social",
  streaming = "Streaming",
  gambling = "Gambling",
  games = "Games",
  shopping = "Shopping",
  news = "News",
  music = "Music",
  unknown = "Unknown",
}
