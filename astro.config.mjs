import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
const isProduction = process.env.NODE_ENV === "production";
// https://astro.build/config
export default defineConfig({
  output: "server",
  server:{
    host:true,
  },
  adapter: cloudflare(),
  site: isProduction ? "https://rmvs.site/" : void 0,
  vite: {
    plugins: [tailwindcss()],
  },
});
