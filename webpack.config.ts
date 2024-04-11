import type { Configuration } from "webpack";

module.exports = {
  entry: {
    serviceWorker: {
      import: "./src/service-worker.ts",
      runtime: false,
    },
    doomScrolling: {
      import: "./src/features/doomScrolling/doomScrolling.ts",
      runtime: false,
    },
    bedtimeMode: {
      import: "./src/features/bedtimeMode/bedtimeMode.ts",
      runtime: false,
    },
  },
} as Configuration;
