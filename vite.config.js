// task-manager-frontend/vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@fullcalendar": fileURLToPath(
        new URL("./node_modules/@fullcalendar", import.meta.url)
      ),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

  server: {
    proxy: {
      // This rule will proxy any request that starts with /api
      "/api": {
        // This is the address of your backend server
        target: "http://localhost:5000",
        // This is important for virtual hosts and preventing CORS issues
        changeOrigin: true,
      },
    },
  },
});
