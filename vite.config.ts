import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    // Ionic runtime is large by design; keep warning useful instead of noisy.
    chunkSizeWarningLimit: 1500,
  },
});
