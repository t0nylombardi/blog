import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [react()],
});

devOptions: {
  tailwindConfig: './tailwind.config.js';
}

