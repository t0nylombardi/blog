import SectionHeader from '../UI/SectionHeader'
import BlogPostList from '../BlogPostList.astro'

function BlogSection() {
  return (
    <section id="blog" className="h-screen snap-start flex flex-col items-center justify-center my-[12rem]">
      <SectionHeader header="_blog" />
      <BlogPostList limit={3} />
      <a href="/blog" className="text-ctp-peach-500 hover:text-ctp-text text-2xl block py-8">
        See more blog posts
      </a>
    </section>
  )
}

export default BlogSection
