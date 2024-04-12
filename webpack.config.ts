import type { Configuration } from "webpack";

module.exports = {
  entry: {
    serviceWorker: {
      import: "./src/service-worker.ts",
      runtime: false,
    },
    doomScrolling: {
      import: "./src/scripts/doomScrolling/doomScrolling.ts",
      runtime: false,
    },
    bedtimeMode: {
      import: "./src/scripts/bedtimeMode/bedtimeMode.ts",
      runtime: false,
    },
  },
} as Configuration;
