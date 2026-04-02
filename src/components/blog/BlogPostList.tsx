import {getSortedPosts} from '@/lib/content/blog'
import {BlogCard} from './BlogCard'

export async function BlogPostList({limit}: {limit?: number}) {
  const posts = await getSortedPosts()
  const visiblePosts = typeof limit === 'number' ? posts.slice(0, limit) : posts

  if (visiblePosts.length < 1) {
    return <h2 className="blog-empty-state">Coming Soon</h2>
  }

  return <div className="blog-card-grid">{visiblePosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
}
