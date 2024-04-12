import { isDevMode } from "@angular/core";
import { BedtimeMode } from "app/types/bedtimeMode";
import dayjs, { Dayjs } from "dayjs";

const TIME_INTERVAL: number = 5; // In seconds, how often to check the time and update the filter
const WIND_DOWN_DURATION: number = 15; // In minutes, how long the transition from normal to grayscale takes
const WIND_UP_DURATION: number = 3; // In minutes, how long the transition from grayscale to normal takes

let body: HTMLElement;
let config: BedtimeMode;
let startAt: Dayjs;
let endAt: Dayjs;
let windDownAt: Dayjs;
let windUpAt: Dayjs;

chrome.storage.sync.get("bedtimeMode").then(result => {
  config = result["bedtimeMode"];
  isDevMode() && console.log(config);

  if (config && config.isEnabled) {
    startAt = configToTime(config.startAt);
    endAt = configToTime(config.endAt);
    windDownAt = startAt.subtract(WIND_DOWN_DURATION, "minute");
    windUpAt = endAt.add(WIND_UP_DURATION, "minute");

    runDetection();
    setInterval(() => {
      runDetection();
    }, TIME_INTERVAL * 1000);
  } else {
    isDevMode() && console.info("Bedtime mode disabled or not configured");
  }
});

function configToTime(config: { hours: number; minutes: number }): Dayjs {
  return dayjs().hour(config.hours).minute(config.minutes).second(0);
}

let previousCoef = 0;
function runDetection() {
  const filterCoef = Math.round(getFilterCoef());
  if (filterCoef === previousCoef) {
    return;
  } else if (filterCoef === 0) {
    body.style.filter = "none";
    return;
  } else {
    applyGrayScaleFilter(filterCoef);
  }
  previousCoef = filterCoef;
}

function getFilterCoef(): number {
  const now = dayjs();

  if (now.isBefore(windDownAt) && now.isAfter(endAt.add(1, "minute"))) {
    isDevMode() && console.log("Before wind down: 0%");
    return 0;
  } else if (now.isAfter(windDownAt) && now.isBefore(startAt)) {
    const secondsFromStart = windDownAt.diff(now, "second");
    const totalSeconds = windDownAt.diff(startAt, "second");
    const coef = (secondsFromStart / totalSeconds) * 100;
    isDevMode() && console.log("Winding down: ", coef + "%");
    return coef;
  } else if (now.isAfter(startAt.subtract(1, "day")) && now.isBefore(endAt)) {
    isDevMode() && console.log("Bedtime (after midnight): 100%");
    return 100;
  } else if (now.isAfter(startAt) && now.isBefore(endAt.add(1, "day"))) {
    isDevMode() && console.log("Bedtime (before midnight): 100%");
    return 100;
  } else if (now.isAfter(endAt) && now.isBefore(windUpAt)) {
    const secondsFromEnd = windUpAt.diff(now, "second");
    const totalSeconds = windUpAt.diff(endAt, "second");
    const result = (secondsFromEnd / totalSeconds) * 100;
    isDevMode() && console.log("Winding up: ", result + "%");
    return result;
  } else {
    console.log("Daytime: 0%");
    return 0;
  }
}

async function applyGrayScaleFilter(intensity: number) {
  if (!body) body = await getDocumentBody();
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
