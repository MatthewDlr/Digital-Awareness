import { isDevMode } from "@angular/core";
import { BedtimeMode } from "app/types/bedtimeMode";
import dayjs, { Dayjs } from "dayjs";

let config: BedtimeMode;

chrome.storage.sync.get("bedtimeMode").then(result => {
  config = result["bedtimeMode"];
  if (config && config.isEnabled) {
    isDevMode() && console.log(config);
    init();
  } else {
    isDevMode() && console.warn("No config found for bedtime mode :/");
  }
});

function init() {
  const result = getPercentageOfGray();
  console.log(result);
  applyGrayScaleFilter(75);
}

function getPercentageOfGray(now: Dayjs = dayjs()): number {
  const startAt = configToTime(config.startAt);
  let endAt = configToTime(config.endAt);
  if (now.hour() >= 12 && now.hour() <= 23) {
    console.log("added 1 day");
    endAt = endAt.add(1, "day");
  }
  console.log(now.toString());
  console.log(startAt.toString());
  console.log(endAt.toString());

  const windDownStart = startAt.subtract(20, "minute");
  const windUpEnd = endAt.add(20, "minute");

  if (now.isBefore(windDownStart) && now.isAfter(windUpEnd)) {
    console.log("Window not started");
    return 0;
  } else if (isBetween(now, windDownStart, startAt)) {
    console.log("Winding down window");
    const totalSeconds = startAt.diff(windDownStart, "second");
    const remainingSeconds = startAt.diff(now, "second");
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  } else if (isBetween(now, startAt, endAt)) {
    console.log("Full grayscale");
    return 100;
  } else if (isBetween(now, endAt, windUpEnd)) {
    console.log("winding up");
    const totalSeconds = windUpEnd.diff(endAt, "second");
    console.log(totalSeconds);
    const elapsedSeconds = endAt.diff(now, "second");
    return (totalSeconds - elapsedSeconds / totalSeconds) * 100;
  } else {
    console.log("day time");
    return 0;
  }
}

function applyGrayScaleFilter(intensity: number): void {
  if (intensity < 0 || intensity > 100) {
    console.error("Intensity must be between 0 and 100");
    return;
  }

  const grayscaleValue = intensity / 100;
  const body = document.body;

  body.style.filter = `grayscale(${grayscaleValue})`;
}

function isBetween(date: Dayjs, dateStart: Dayjs, dateEnd: Dayjs) {
  return date.isAfter(dateStart) && date.isBefore(dateEnd);
}

function configToTime(config: { hours: number; minutes: number }): Dayjs {
  return dayjs().hour(config.hours).minute(config.minutes).second(0);
}
