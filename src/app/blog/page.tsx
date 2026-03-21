import type {Metadata} from 'next'
import {BaseWrapper} from '@components/layout/BaseWrapper'
import {BlogPostList} from '@components/blog/BlogPostList'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '_blog | t0nylombardi.dev',
  description: 'Blog posts by Anthony Lombardi',
}

export default async function BlogIndexPage() {
  return (
    <BaseWrapper>
      <section className="fullscreen-section min-h-screen py-[7rem] flex flex-col items-center">
        <h3 className="text-3xl md:text-5xl font-medium text-ctp-mauve-500">_blog</h3>
        <BlogPostList />
      </section>
    </BaseWrapper>
  )
}
