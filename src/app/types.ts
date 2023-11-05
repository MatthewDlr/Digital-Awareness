export type blockedSite = {
  host: string;
  allowedUntil: string;
  isMandatory: boolean;
  timesBlocked: number;
  timesAllowed: number;
  category: category;
};

enum category {
  social = 'Social',
  streaming = 'Streaming',
  adult = 'Adult',
  gambling = 'Gambling',
  games = 'Games',
  shopping = 'Shopping',
  news = 'News',
}
