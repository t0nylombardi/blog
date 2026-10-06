import type {Metadata} from 'next'
import Script from 'next/script'
import './globals.css'
import {siteConfig} from '@/domain/site/site.data'
import {footerSocialLinks} from '@/domain/profile/social.data'
import {JsonLd} from '@/components/JsonLd'
import {absoluteUrl, pageMetadata} from '@/lib/seo'

const siteUrl = siteConfig.url
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? siteConfig.gaId

export const metadata: Metadata = {
  ...pageMetadata(siteConfig.title, siteConfig.description, '/'),
  metadataBase: new URL(siteUrl),
  title: {default: siteConfig.title, template: '%s | Anthony Lombardi'},
  description: siteConfig.description,
  authors: [{name: siteConfig.name, url: siteUrl}],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1},
  },
  icons: {
    icon: '/favicon/favicon.ico',
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <JsonLd
          id="site-schema"
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': absoluteUrl('/#person'),
                name: siteConfig.name,
                url: siteUrl,
                image: absoluteUrl(siteConfig.image),
                sameAs: Object.values(footerSocialLinks),
              },
              {
                '@type': 'WebSite',
                '@id': absoluteUrl('/#website'),
                name: siteConfig.name,
                url: siteUrl,
                description: siteConfig.description,
                inLanguage: 'en-US',
                publisher: {'@id': absoluteUrl('/#person')},
              },
            ],
          }}
        />
        {children}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        <Script id="ga-script" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
        </Script>
      </body>
    </html>
  )
}
