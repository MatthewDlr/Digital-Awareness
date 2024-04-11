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
  },
} as Configuration;
