import { isDevMode } from "@angular/core";

let isDoomScrollingEnabled: boolean = false;
let totalScrolls: number = 0;
let previousScrollCount: number = 0;
let realScrollsCount: number = 0;
const tabOpenedAt: Date = new Date();
let intervalId: any;
let lastScrollTop = 0;
let scrollTreshold: number = 100;

chrome.storage.sync.get("doomScrollingNotification", result => {
  if (result["doomScrollingNotification"] == true) {
    isDoomScrollingEnabled = true;
    intervalId = setInterval(checkChanges, 2500);
  }
});

console.log("isDevMode: " + isDevMode());

chrome.storage.sync.get("doomScrollingTreshold", result => {
  scrollTreshold = result["doomScrollingTreshold"];
  isDevMode() ? console.log("scrollTreshold: ", scrollTreshold) : null;
});

// Watching for scroll down event
window.addEventListener(
  "scroll",
  function () {
    const st = window.scrollY;
    if (st > lastScrollTop && isDoomScrollingEnabled) {
      totalScrolls++;
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false,
);

window.addEventListener("keydown", function (e) {
  if (e.key == "ArrowDown" && isDoomScrollingEnabled) {
    totalScrolls++;
  }
});

function checkChanges() {
  if (previousScrollCount < totalScrolls) {
    realScrollsCount++;
    isDevMode() ? console.log("user scrolled: " + realScrollsCount + " times") : null;
  }
  previousScrollCount = totalScrolls;

  if (!isDevMode() && tabOpenedAt > new Date(Date.now() - 1000 * 60 * 10)) {
    isDevMode() ? console.log("Wait 10 min before checking") : null;
    return;
  }

  if ((isDevMode && realScrollsCount > 5) || realScrollsCount > scrollTreshold) {
    console.log("user is doom scrolling");
    isDevMode() ? null : window.scrollTo({ top: 0, behavior: "smooth" });
    clearInterval(intervalId);
    window.removeEventListener("scroll", function () {});
    sendNotification();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0 });
      }
    }, 1000);
  }
}

function sendNotification() {
  chrome.runtime.sendMessage({ type: "doomScrolling" });
}
