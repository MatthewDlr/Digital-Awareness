import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        serviceWorker: path.resolve(__dirname, "src/service-worker.ts"),
        doomScrolling: path.resolve(__dirname, "src/doomScrolling.ts"),
      },
    },
  },
});
