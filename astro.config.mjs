// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Project site on GitHub Pages: https://stevezhuhb.github.io/SteveBlog/
// If the repo is renamed to SteveZhuHB.github.io, delete `base`.
export default defineConfig({
  site: "https://stevezhuhb.github.io",
  base: "/SteveBlog",
  integrations: [mdx(), sitemap()],
});
