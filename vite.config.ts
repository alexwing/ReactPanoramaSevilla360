import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/sevilla360/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo192.png", "logo512.png", "robots.txt"],
      manifest: {
        short_name: "Sevilla360",
        name: "Sevilla, cerca de 1870 (Jean Laurent)",
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
        icons: [
          { src: "logo192.png", type: "image/png", sizes: "192x192" },
          { src: "logo512.png", type: "image/png", sizes: "512x512" },
        ],
      },
      workbox: {
        globIgnores: [
          "**/360photo/**",
          "**/360photo-new/**",
          "**/360photoBN/**",
          "**/360photoOriginal/**",
          "**/360photo*.jpg",
          "**/images/**",
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: null,
      },
    }),
  ],
  server: { port: 3000 },
  build: { outDir: "build" },
});
