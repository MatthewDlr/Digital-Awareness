import { isDevMode } from "@angular/core";
import { BedtimeMode } from "app/types/bedtimeMode";
import dayjs, { Dayjs } from "dayjs";

let config: BedtimeMode;
let body: HTMLElement;

chrome.storage.sync.get("bedtimeMode").then(result => {
  config = result["bedtimeMode"];
  if (config && config.isEnabled) {
    isDevMode() && console.log(config);
    runDetection();
    setInterval(() => {
      runDetection();
    }, 3000);
  } else {
    isDevMode() && console.warn("No config found for bedtime mode :/");
  }
});

function runDetection() {
  const filterAmount = Math.round(getPercentageOfGray());
  isDevMode() && console.info("Grayscale coef: " + filterAmount);
  if (filterAmount > 0) {
    applyGrayScaleFilter(filterAmount);
  }
}

function getPercentageOfGray(now: Dayjs = dayjs()): number {
  const startAt = configToTime(config.startAt);
  const windDownAt = startAt.subtract(15, "minute");
  const endAt = configToTime(config.endAt);
  const windUpAt = endAt.add(3, "minute");

  if (now.isBefore(windDownAt) && now.isAfter(endAt.add(1, "minute"))) {
    console.log("daytime");
    return 0;
  } else if (now.isAfter(windDownAt) && now.isBefore(startAt)) {
    console.log("wind down");
    const secondsFromStart = windDownAt.diff(now, "second");
    const totalSeconds = windDownAt.diff(startAt, "second");
    return (secondsFromStart / totalSeconds) * 100;
  } else if (now.isAfter(startAt.subtract(1, "day")) && now.isBefore(endAt)) {
    console.log("bedtime (after midnight)");
    return 100;
  } else if (now.isAfter(startAt) && now.isBefore(endAt.add(1, "day"))) {
    console.log("bedtime (before midnight)");
    return 100;
  } else if (now.isAfter(endAt) && now.isBefore(windUpAt)) {
    console.log("wind up");
    const secondsFromEnd = windUpAt.diff(now, "second");
    const totalSeconds = windUpAt.diff(endAt, "second");
    return (secondsFromEnd / totalSeconds) * 100;
  } else {
    console.log("daytime");
    return 0;
  }
}

async function applyGrayScaleFilter(intensity: number) {
  if (intensity < 0 || intensity > 100) {
    isDevMode() && console.warn("Intensity must be between 0 and 100");
    return;
  }

  if (!body) {
    body = await getDocumentBody();
  }
  body.style.filter = `grayscale(${intensity / 100})`;
}

function getDocumentBody(): Promise<HTMLElement> {
  let attempts = 0;
  const maxAttempts = 1000;

  return new Promise((resolve, reject) => {
    const checkBody = setInterval(() => {
      if (document.body) {
        clearInterval(checkBody);
        resolve(document.body);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkBody);
        reject(new Error("Could not find body element"));
      }
      attempts++;
    }, 1);
  });
}

function configToTime(config: { hours: number; minutes: number }): Dayjs {
  return dayjs().hour(config.hours).minute(config.minutes).second(0);
}
