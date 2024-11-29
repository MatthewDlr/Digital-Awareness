import { isDevMode } from "@angular/core";
import { getDoomScrollingState } from "app/shared/chrome-storage-api";

const DEPTH_BOTTOM_METERS = 15; //Depth in meters
const DEPTH_BOTTOM_PIXEL: number = meterToPixel(DEPTH_BOTTOM_METERS);
const DEPTH_START: number = DEPTH_BOTTOM_PIXEL - meterToPixel(DEPTH_BOTTOM_METERS * 0.4);

getDoomScrollingState().then(state => {
  if (!state) return;

  const anchor = document.createElement("div");
  anchor.className = "anchor";

  const sea = document.createElement("div");
  sea.className = "sea";
  anchor.appendChild(sea);

  const depth = document.createElement("div");
  depth.className = "depth";
  anchor.appendChild(depth);

  // If in dev mode, add depth lines and marker on the page
  if (isDevMode()) {
    for (let i = 0; i < 5; i++) {
      const line = document.createElement("div");
      line.className = "depth--line";
      depth.appendChild(line);
    }
    const span = document.createElement("span");
    span.textContent = "0m";
    const depthMarker = document.createElement("div");
    depthMarker.className = "depth--marker";
    const marker = document.createElement("div");
    marker.className = "marker";

    marker.appendChild(span);
    depthMarker.appendChild(marker);
    anchor.appendChild(depthMarker);
  }

  document.body.appendChild(anchor);
  window.addEventListener("scroll", scrollEvent);
});

function scrollEvent(event: Event) {
  const s = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.body.scrollHeight;

  const anchors: HTMLElement[] = Array.from(document.querySelectorAll(".anchor"));
  anchors.forEach(function (anchor) {
    if (anchor.offsetHeight != docHeight) {
      anchor.style.height = docHeight + "px";
    }
  });

  const seas: HTMLElement[] = Array.from(document.querySelectorAll(".sea"));
  const progress = (s - DEPTH_START) / (DEPTH_BOTTOM_PIXEL - DEPTH_START);
  if (progress <= 0) {
    seas.forEach(sea => (sea.style.opacity = "0"));
  } else if (progress <= 1) {
    seas.forEach(sea => (sea.style.opacity = progress.toString()));
  } else {
    // Prevent further scrolling
    event.preventDefault();
    window.scrollTo(0, DEPTH_BOTTOM_PIXEL);
    seas.forEach(sea => (sea.style.opacity = "1"));
  }

  // set marker position
  let markerProgress = s / DEPTH_BOTTOM_PIXEL;
  if (markerProgress < 0) {
    markerProgress = 0;
  }
  if (markerProgress > 1) {
    markerProgress = 1;
  }
  const pos = markerProgress * (window.innerHeight - 60);
  document.querySelectorAll(".marker").forEach(marker => {
    (marker as HTMLElement).style.transform = "translate(0, " + pos + "px)";
  });

  // Using 96DPI
  const m = Math.round((s / 96) * 2.54) / 100;
  document.querySelectorAll(".marker span").forEach(span => {
    span.textContent = m + "m";
  });
}

function meterToPixel(meter: number) {
  const pixel = ((meter * 100) / 2.54) * 96; // Using 96DPI
  return pixel;
}
