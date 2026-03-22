import {cache} from 'react'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import {unstable_cache} from 'next/cache'
import {blogFrontmatterSchema, type BlogPost} from '@/lib/content/schema'

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

const collectContentFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, {withFileTypes: true})

  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return collectContentFiles(fullPath)
      }

      return /\.(md|mdx)$/.test(entry.name) ? [fullPath] : []
    }),
  )

  return nestedFiles.flat()
}

const parsePostFile = async (filePath: string): Promise<BlogPost> => {
  const raw = await fs.readFile(filePath, 'utf-8')
  const {data, content} = matter(raw)

  const parsed = blogFrontmatterSchema.parse(data)
  const relativePath = path.relative(BLOG_DIR, filePath)
  const slug = relativePath.replace(/\.(md|mdx)$/, '').split(path.sep).join('/')
  const pubDate = parsed.pubDate ?? parsed.date

  if (!pubDate) {
    throw new Error(`Missing pubDate/date frontmatter for post: ${slug}`)
  }

  return {
    ...parsed,
    pubDate,
    slug,
    content,
  }
}

const loadPosts = cache(async (): Promise<BlogPost[]> => {
  const files = await collectContentFiles(BLOG_DIR)
  const posts = await Promise.all(files.map(parsePostFile))
  return posts
})

const loadPostsCached = unstable_cache(async () => loadPosts(), ['blog-posts-v1'], {
  revalidate: 3600,
  tags: ['blog-posts'],
})

const toDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined
  return value instanceof Date ? value : new Date(value)
}

const hydratePost = (post: BlogPost): BlogPost => ({
  ...post,
  pubDate: toDate(post.pubDate) ?? new Date(0),
  updatedDate: toDate(post.updatedDate),
})

export class BlogRepository {
  async getAllPosts(): Promise<BlogPost[]> {
    const posts = await loadPostsCached()
    return posts.map(hydratePost)
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getAllPosts()
    return posts.find((post) => post.slug === slug) ?? null
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    const posts = await this.getAllPosts()
    const now = Date.now()
    const isProd = process.env.NODE_ENV === 'production'

    return posts.filter((post) => {
      const isScheduled = post.pubDate.getTime() > now
      if (isScheduled) return false
      if (isProd && post.draft) return false
      return true
    })
  }

  async getSortedPosts(): Promise<BlogPost[]> {
    const posts = await this.getPublishedPosts()
    return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  }
}

export const blogRepository = new BlogRepository()

export const getAllPosts = () => blogRepository.getAllPosts()
export const getPostBySlug = (slug: string) => blogRepository.getPostBySlug(slug)
export const getPublishedPosts = () => blogRepository.getPublishedPosts()
export const getSortedPosts = () => blogRepository.getSortedPosts()
