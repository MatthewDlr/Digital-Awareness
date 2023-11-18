import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    serviceWorker: {
      import: 'src/service-worker.ts',
      runtime: false,
    },
    background: {
      import: 'src/background.ts',
      runtime: false,
    },
  },
} as Configuration;
