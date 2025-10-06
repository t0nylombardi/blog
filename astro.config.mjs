import react from '@astrojs/react'
import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'

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
        langs: [
          () => import('@shikijs/langs/ruby'),
          () => import('@shikijs/langs/typescript'),
          () => import('@shikijs/langs/javascript'),
          () => import('@shikijs/langs/ts'),
          () => import('@shikijs/langs/bash'),
          () => import('@shikijs/langs/json'),
          () => import('@shikijs/langs/css'),
          () => import('@shikijs/langs/html'),
          () => import('@shikijs/langs/go'),
        ],
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
      langs: ['ruby', 'typescript', 'javascript', 'ts', 'bash', 'json', 'css', 'html', 'go'],
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
