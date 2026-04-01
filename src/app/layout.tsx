import type {Metadata} from 'next'
import Script from 'next/script'
import './globals.css'
import {siteConfig} from '@/domain/site/site.data'

const siteUrl = 'https://t0nylombardi.dev'
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? siteConfig.gaId

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: '/favicon/favicon.ico',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteUrl,
    images: [{url: '/amoji_avatar.svg'}],
  },
  twitter: {
    creator: '@t0nylombardi',
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        <Script id="ga-script" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
        </Script>
      </body>
    </html>
  )
}
