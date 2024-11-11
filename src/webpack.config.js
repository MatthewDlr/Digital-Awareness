module.exports = {
  entry: {
    serviceWorker: {
      import: "./service-worker.ts",
      runtime: false,
    },
    doomScrolling: {
      import: "./scripts/doomScrolling/doomScrolling.script.ts",
      runtime: false,
    },
    bedtimeMode: {
      import: "./scripts/bedtimeMode/bedtimeMode.script.ts",
      runtime: false,
    },
  },
  optimization: {
    runtimeChunk: false,
  },
};
