import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  },
  resolve: {
    alias: {
      "edytor-solid": "edytor-solid",
      edytor: "edytor"
    }
  }
});
