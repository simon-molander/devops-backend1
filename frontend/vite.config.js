import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/customers": {
        target: "http://localhost:8081",
        changeOrigin: true
      },
      "/api/bookings": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/api/rooms": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/api/reviews": {
        target: "http://localhost:8082",
        changeOrigin: true
      }
    }
  }
});