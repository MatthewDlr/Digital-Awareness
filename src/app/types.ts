export type blockedSite = {
  host: string;
  allowedUntil: string;
  category: blockCategory;
};

export enum blockCategory {
  social = 'Social',
  news = 'News',
  streaming = 'Streaming',
}
