import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts:true,
      hmr:false,
    proxy: {
      "/api": {
        target: "https://superseraphically-umbonate-leighton.ngrok-free.dev",
        changeOrigin: true
      },
      "/ws": {
        target: "wss://superseraphically-umbonate-leighton.ngrok-free.dev",
        ws: true
      }
    }
  }
});