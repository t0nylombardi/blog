import Link from 'next/link'
import {BlogPostList} from '@/components/blog'
import {SectionHeader} from '@/components/ui'

function BlogSection() {
  return (
    <section
      id="blog"
      className="h-screen snap-start scroll-mt-20 flex flex-col items-center justify-center my-[12rem]"
    >
      <SectionHeader header="_blog" />
      <BlogPostList limit={3} />
      <Link href="/blog" className="text-ctp-peach-500 hover:text-ctp-text text-2xl block py-8">
        See more blog posts
      </Link>
    </section>
  )
}

export default BlogSection
