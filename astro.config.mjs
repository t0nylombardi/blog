import react from '@astrojs/react'
import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import fs from 'fs'
import {BundledLanguage} from 'shiki/bundled/web'

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
      shikiConfig: {
        theme: 'catppuccin-macchiato',
        langs: [ruby, typescript, javascript, ts, bash, json, css, html, go],
        wrap: true,
      },
      gfm: false,
    }),
    sitemap(),
  ],
  server: {
    port: 3031,
  },
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-macchiato',
      langs: [ruby, typescript, javascript, ts, bash, json, css, html, go],
      wrap: true,
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
