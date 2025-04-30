import react from '@astrojs/react'
import {defineConfig} from 'astro/config'
import netlify from '@astrojs/netlify'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import fs from 'fs'

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
  vite: {
    resolve: {
      alias: {
        // Example alias for debugging
        '@components': '/src/components',
      },
    },
    plugins: [
      {
        name: 'debug-resolve',
        resolveId(source) {
          console.log(`[DEBUG] Resolving: ${source}`)
          return null // Let Vite handle the resolution
        },
      },
    ],
  },
})

devOptions: {
  tailwindConfig: './tailwind.config.js'
}