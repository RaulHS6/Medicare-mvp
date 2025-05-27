import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MediSecure",
        short_name: "MediSecure",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0d6efd",
        description: "Gestión segura de expedientes clínicos digitales.",
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173, // <--- Puerto de frontend
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
