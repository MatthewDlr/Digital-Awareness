import type { Configuration } from "webpack";

module.exports = {
  entry: {
    serviceWorker: {
      import: "./src/scripts/service-worker.ts",
      runtime: false,
    },
    doomScrolling: {
      import: "./src/scripts/doomScrolling/doomScrolling.script.ts",
      runtime: false,
    },
    bedtimeMode: {
      import: "./src/scripts/bedtimeMode/bedtimeMode.script.ts",
      runtime: false,
    },
  },
} as Configuration;
