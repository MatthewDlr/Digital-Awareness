import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    serviceWorker: {
      import: 'src/service-worker.ts',
      runtime: false,
    },
  },
} as Configuration;
