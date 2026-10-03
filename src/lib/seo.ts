import type {Metadata} from 'next'
import {siteConfig} from '@/domain/site/site.data'

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString()

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {canonical: path},
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: 'en_US',
      title,
      description,
      url: path,
      images: [{url: siteConfig.image, alt: siteConfig.name}],
    },
    twitter: {
      card: 'summary',
      creator: '@t0nylombardi',
      title,
      description,
      images: [siteConfig.image],
    },
  }
}
