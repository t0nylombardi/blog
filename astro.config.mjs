import react from '@astrojs/react'
import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import fs from 'fs'

import sitemap from '@astrojs/sitemap'

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
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {theme: 'dracula'},
      gfm: false,
    }),
    sitemap(),
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
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
    plugins: [
      {
        name: 'debug-resolve',
        resolveId(source) {
          return null
        },
      },
      tailwindcss(),
    ],
  },
})
