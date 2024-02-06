import { isDevMode } from "@angular/core";

const website: string = determineWebsite();
let isBingeWatchingEnabled: boolean = false;
let timerInterval: any;
let videoTimer: number = 0;
let videoDuration: number = 0;

console.log("Website: " + website);

chrome.storage.sync.get("bingeWatchingToggle").then(result => {
  isBingeWatchingEnabled = result["bingeWatchingToggle"] || false;
  isDevMode() && console.log("Binge Watching state: " + isBingeWatchingEnabled);

  if (isBingeWatchingEnabled) {
    // Get the total duration of the video
    switch (website) {
      case "youtube":
        videoDuration = getYoutubeVideoDuration();
        break;
      default:
        videoDuration = 0;
    }
    console.log("Video duration: " + videoDuration);
  }
  timerInterval = setInterval(getVideoTimer, 1000);
});

function getVideoTimer() {
  if (isYoutubeVideoPaused()) return;

  let value = 0;
  switch (website) {
    case "youtube":
      value = getYoutubeVideoTimer();
      break;
    default:
      value = 0;
  }
  console.log("Value: " + value);
  console.log("Video timer: " + videoTimer);

  if (value <= videoTimer) {
    videoTimer += 1;
  } else if (value > videoTimer) {
    videoTimer = value;
  }
  console.log("Video timer: " + videoTimer);
  if (videoTimer >= videoDuration) {
    console.log("You have been watching for " + videoTimer + " seconds");
    clearInterval(timerInterval);
  }
}

function isYoutubeVideoPaused(): boolean {
  return document.getElementsByClassName("ytp-play-button")?.item(0)?.getAttribute("data-title-no-tooltip") == "Play";
}

function getYoutubeVideoTimer(): number {
  return stringToSeconds(document.getElementsByClassName("ytp-time-current")?.item(0)?.textContent || "0:00");
}

function getYoutubeVideoDuration(): number {
  return stringToSeconds(document.getElementsByClassName("ytp-time-duration")?.item(0)?.textContent || "0:00");
}

function stringToSeconds(time: string): number {
  const timeArray: string[] = time.split(":");
  let seconds: number = Number(timeArray[1]);
  seconds += Number(timeArray[0]) * 60;
  return seconds;
}

function determineWebsite() {
  let url = new URL(window.location.href).host;
  if (url.substring(0, 3) == "www") url = url.substring(4);
  const website = url.split(".")[0];
  return website.toLocaleLowerCase();
}
