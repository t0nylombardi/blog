import {getSortedPosts} from '@/lib/content/blog'
import {BlogCard} from '@/components/blog/BlogCard'

export async function BlogPostList({limit}: {limit?: number}) {
  const posts = await getSortedPosts()
  const visiblePosts = typeof limit === 'number' ? posts.slice(0, limit) : posts

  if (visiblePosts.length < 1) {
    return <h2 className="mt-6 text-center text-8xl text-ctp-text">Coming Soon</h2>
  }

  return (
    <div className="px-2 mt-12 flex w-full flex-col gap-x-8 justify-between md:flex-row md:flex-wrap">
      {visiblePosts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
