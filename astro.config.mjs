import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [react(), tailwind(), icon({
      include: {
        bi: ["*"],
        emojione: ["*"],
        feather: ["*"],
        logos: ["*"],
        mdi: ["*"],
        'vscode-icons': ["*"],

      },
    })],
  server: {
    port: 3031
  },
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false
    }
  }
});

devOptions: {
  tailwindConfig: './tailwind.config.js';
}