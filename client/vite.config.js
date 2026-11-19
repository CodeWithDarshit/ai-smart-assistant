import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite runs the React app and forwards /api calls to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
