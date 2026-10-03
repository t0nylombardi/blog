import {pageMetadata} from '@/lib/seo'
import {BlogPostList} from '@/components/blog'
import {BaseWrapper} from '@/components/layout'

export const revalidate = 3600



export const metadata = pageMetadata(
  'Software Engineering Blog',
  'Practical articles by Anthony Lombardi on Ruby on Rails, software architecture, testing, and building web applications.',
  '/blog',
)

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
