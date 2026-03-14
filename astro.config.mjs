import { defineConfig, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
// 仅在 CI/部署时设置 site，本地 build+preview 不设置，避免预览时资源或 canonical 指向生产域名
const isDeployBuild =
  process.env.CI === "true" || process.env.DEPLOY_BUILD === "true";
// https://astro.build/config
export default defineConfig({
  // output: "server",
  server: {
    host: true,
  },
  adapter: cloudflare(),
  site: isDeployBuild ? "https://rmvs.site/" : void 0,
  env: {
    schema: {
      GOOGLE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
