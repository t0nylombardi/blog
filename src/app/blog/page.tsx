import type {Metadata} from 'next'
import {BlogPostList} from '@/components/blog'
import {BaseWrapper} from '@/components/layout'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '_blog | t0nylombardi.dev',
  description: 'Blog posts by Anthony Lombardi',
}

export default async function BlogIndexPage() {
  return (
    <BaseWrapper>
      <section className="blog-theme blog-index">
        <div className="blog-shell">
          <h1 className="blog-index__title">_blog</h1>
          <BlogPostList />
        </div>
      </section>
    </BaseWrapper>
  )
}
