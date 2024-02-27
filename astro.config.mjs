import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';
import icon from "astro-icon";

const tokyoNight = JSON.parse(fs.readFileSync('./src/layouts/themes/tokyo-night.json', 'utf8'))

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
    }}),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'dracula' },
      gfm: false,
    }),
  ],
  server: {
    port: 3031
  },
  markdown: {
    shikiConfig: {
      theme: tokyoNight,
      langs: [],
      wrap: false
    }
  },
});

devOptions: {
  tailwindConfig: './tailwind.config.js';
}