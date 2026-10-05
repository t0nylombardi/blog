import type {Metadata} from 'next'
import {BlogArticle} from '@/components/blog/BlogArticle'
import {BaseWrapper} from '@/components/layout'
import {getSortedPosts} from '@/lib/content/blog'
import {getVisiblePost} from '@/lib/content/getVisiblePost'
import {blogPostMetadata} from '@/lib/content/blogPostSeo'

export const revalidate = 3600

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const posts = await getSortedPosts()
  return posts.map((post) => ({slug: post.slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  return blogPostMetadata(await getVisiblePost(slug))
}

export default async function BlogPostPage({params}: PageProps) {
  const {slug} = await params
  const post = await getVisiblePost(slug)

  return (
    <BaseWrapper>
      <BlogArticle post={post} />
    </BaseWrapper>
  )
}
