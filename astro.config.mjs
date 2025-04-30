import react from '@astrojs/react'
import {defineConfig} from 'astro/config'
import netlify from '@astrojs/netlify'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

const tokyoNight = JSON.parse(fs.readFileSync('./src/layouts/themes/tokyo-night.json', 'utf8'))

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  title: 't0nylombardi.dev',
  site: 'https://t0nylombardi.dev',
  trailingSlash: 'never',
  output: 'server',
  adapter: netlify(),
  integrations: [
    react({
      experimentalReactChildren: true,
      experimental: {clientOnly: true},
    }),
    tailwind(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {theme: 'dracula'},
      gfm: false,
    }),
  ],
  server: {
    port: 3031,
  },
  markdown: {
    shikiConfig: {
      theme: tokyoNight,
      langs: [],
      wrap: false,
    },
  },
})

devOptions: {
  tailwindConfig: './tailwind.config.js'
}
