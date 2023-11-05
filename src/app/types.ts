export type blockedSite = {
  host: string;
  allowedUntil: string;
  isMandatory: boolean;
  timesBlocked: number;
  timesAllowed: number;
};
