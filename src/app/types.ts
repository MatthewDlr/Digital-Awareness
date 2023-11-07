export type watchedWebsite = {
  url: string;
  allowedUntil: string;
  timesBlocked: number;
  timesAllowed: number;
  category: category;
  isMandatory:boolean;
};

export enum category {
  social = 'Social',
  streaming = 'Streaming',
  adult = 'Adult',
  gambling = 'Gambling',
  games = 'Games',
  shopping = 'Shopping',
  news = 'News',
  unknown = ''
}
