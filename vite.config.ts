import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  optimizeDeps: {
    exclude: ["@xmtp/wasm-bindings"],
  },
  build: {
    sourcemap: true,
  },
});
