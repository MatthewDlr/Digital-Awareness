export type BedtimeMode = {
  isEnabled: boolean;
  startAt: { hours: number; minutes: number };
  endAt: { hours: number; minutes: number };
};

export function convertTime(time: string): { hours: number; minutes: number } {
  const timeStr = time.split(":");
  return { hours: Number(timeStr[0]), minutes: Number(timeStr[1]) };
}
