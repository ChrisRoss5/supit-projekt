import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      "@": path.resolve("./src"),
    },
    /* https://kit.svelte.dev/docs/adapter-static#spa-mode */
    prerender: { entries: [] },
    /* todo outDir: "dist", */
  },
};

export default config;
