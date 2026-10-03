import type {MetadataRoute} from 'next'
import {getPublishedPosts} from '@/lib/content/blog'
import {absoluteUrl} from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()
  return [
    ...['/', '/blog', '/projects', '/resume'].map((path) => ({url: absoluteUrl(path)})),
    ...posts.filter((post) => !post.draft).map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedDate ?? post.pubDate,
    })),
  ]
}
