import { isDevMode } from "@angular/core";

interface SupportedWebsite {
  baseURL: string;
  getVideoFullDuration: () => number;
  getVideoCurrentTime: () => number;
  isVideoPaused: () => boolean;
}

class Youtube implements SupportedWebsite {
  baseURL = "https://www.youtube.com/watch";
  getVideoFullDuration(): number {
    return stringToSeconds(document.getElementsByClassName("ytp-time-duration")?.item(0)?.textContent || "0:00");
  }

  getVideoCurrentTime(): number {
    return stringToSeconds(document.getElementsByClassName("ytp-time-current")?.item(0)?.textContent || "0:00");
  }

  isVideoPaused(): boolean {
    return (
      document.getElementsByClassName("ytp-play-button")?.item(0)?.getAttribute("data-title-no-tooltip") == "Play" ||
      document.getElementsByClassName("ytp-play-button")?.item(0)?.getAttribute("data-title-no-tooltip") == "Replay"
    );
  }
}

let isBingeWatchingEnabled: boolean = false;
let localCurrentTime: number = 0;
let videoDuration: number = 0;
let timerInterval: any;
const website: SupportedWebsite = websiteFactory(new URL(window.location.href).host);
console.log("Website: " + website);

chrome.storage.sync.get("bingeWatchingToggle").then(result => {
  isBingeWatchingEnabled = result["bingeWatchingToggle"] || false;
  isDevMode() && console.log("Binge Watching state: " + isBingeWatchingEnabled);

  getVideoFullDuration();
  if (isBingeWatchingEnabled) {
    timerInterval = setInterval(getVideoTimer, 1000);
  }
});

let previousURL: string = window.location.href;
setInterval(() => {
  const currentURL = window.location.href;
  if (previousURL != currentURL) {
    previousURL = currentURL;
    console.log("URL changed");

    if (currentURL.startsWith(website.baseURL)) {
      console.log("New video");
      getVideoFullDuration();
      timerInterval = setInterval(getVideoTimer, 1000);
    } else {
      localCurrentTime = videoDuration = 0;
      clearInterval(timerInterval);

      console.log("Not a video");
    }
  }
}, 1000);

function getVideoFullDuration() {
  videoDuration = website.getVideoFullDuration();
  isDevMode() && console.log("Video duration: " + videoDuration);
}

// In some websites like youtube, when the video overlay is hidden, the video timer is not updated.
// So we need to track a local timer to know the real time the user has been watching the video.
function getVideoTimer() {
  if (website.isVideoPaused()) return;

  const currentTime = website.getVideoCurrentTime();

  if (currentTime <= localCurrentTime) {
    localCurrentTime += 1; // If the video timer is not updated, we add 1 second to the local timer
  } else if (currentTime > localCurrentTime) {
    localCurrentTime = currentTime; // If the video timer is updated, we update the local timer to sync with the real time
  }
  isDevMode() && console.log("Video timer: " + localCurrentTime);

  if (localCurrentTime >= videoDuration) {
    console.log("Video finished");
    clearInterval(timerInterval);
  } else if (localCurrentTime * 1.01 >= videoDuration) {
    console.log("Video almost finished");
    createOverlay();
  }
}

function websiteFactory(websiteURL: string): SupportedWebsite {
  if (websiteURL.substring(0, 3) == "www") websiteURL = websiteURL.substring(4); // Remove www. from the URL
  websiteURL = websiteURL.split(".")[0].toLowerCase(); // Get just the the website name

  switch (websiteURL) {
    case "youtube":
      return new Youtube();
    default:
      throw new Error("Website not recognized");
  }
}

function stringToSeconds(time: string): number {
  const timeArray: string[] = time.split(":");
  let seconds: number = Number(timeArray[1]);
  seconds += Number(timeArray[0]) * 60;
  return seconds;
}

function createOverlay() {
  console.log("injected createOverlay() function");
  const overlay = document.createElement("div");
  overlay.classList.add("fixed", "inset-0", "bg-black", "opacity-25", "z-40");

  // Create the popup container with 50% width and height, centered
  const popup = document.createElement("div");
  popup.classList.add(
    "fixed",
    "top-1/4",
    "left-1/4",
    "w-1/2",
    "h-1/2",
    "bg-white",
    "z-50",
    "flex",
    "justify-center",
    "items-center",
  );

  // Optional: Add content to the popup,   for example, a message or any HTML elements
  const popupContent = document.createElement("div");
  popupContent.textContent = "This is the popup content"; // Example content, can be replaced or expanded
  popup.appendChild(popupContent);

  // Append the overlay and popup to the body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Optional: Add a way to close the popup, for example, clicking on the overlay
  overlay.addEventListener("click", function () {
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  });
}
