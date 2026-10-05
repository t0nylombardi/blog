import type {Metadata} from 'next'
import type {BlogPost} from '@/lib/content/schema'
import {absoluteUrl} from '@/lib/seo'
import {siteConfig} from '@/domain/site/site.data'

const postImage = (post: BlogPost) => post.heroImage ?? post.image ?? post.coverImage ?? siteConfig.image

export function blogPostMetadata(post: BlogPost): Metadata {
  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.description
  const image = postImage(post)
  const canonical = `/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {canonical},
    ...(post.draft || post.pubDate.getTime() > Date.now() ? {robots: {index: false, follow: true}} : {}),
    authors: [{name: post.author}],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: siteConfig.name,
      locale: 'en_US',
      publishedTime: post.pubDate.toISOString(),
      modifiedTime: post.updatedDate?.toISOString(),
      authors: [post.author],
      tags: post.tags,
      url: canonical,
      images: [{url: image, alt: post.title}],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@t0nylombardi',
      site: '@t0nylombardi',
      title,
      description,
      images: [image],
    },
  }
}

export function blogPostStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl(postImage(post)),
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    author: {'@type': 'Person', name: post.author},
    publisher: {'@id': absoluteUrl('/#person')},
    isPartOf: {'@id': absoluteUrl('/#website')},
    inLanguage: 'en',
  }
}
