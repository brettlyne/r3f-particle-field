import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "R3F Particle Field",
        short_name: "R3F Particle Field",
        description: "R3F Particle Field docs",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/feathers/featherIcon600.png",
            type: "image/png",
            sizes: "600x600",
          },
        ],
      },
    }),
  ],
  base: "/r3f-particle-field/",
});
