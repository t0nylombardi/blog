import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {CopyCodeButton, FormattedDate, mdxComponents} from '@/components/blog'
import {BaseWrapper} from '@/components/layout'
import {getPostBySlug, getSortedPosts} from '@/lib/content/blog'
import {renderMdx} from '@/lib/content/renderMdx'

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
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.description
  const image = post.heroImage ?? post.image
  const canonical = `/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {canonical},
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: image ? [{url: image}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@t0nylombardi',
      site: '@t0nylombardi',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function BlogPostPage({params}: PageProps) {
  const {slug} = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && post.draft) {
    notFound()
  }

  const content = await renderMdx(post.content, mdxComponents)

  return (
    <BaseWrapper>
      <section className="blog-theme">
        <div className="blog-shell">
          <main className="blog-post blog-surface">
            <header className="blog-post__header">
              <h1 className="blog-post__title">{post.title}</h1>
              <p className="blog-post__description">{post.description}</p>
              <p className="blog-post__meta">
                <span>By {post.author}</span>
                <span>on</span>
                <FormattedDate date={post.pubDate} />
              </p>
            </header>

            {post.heroImage && (
              <div className="blog-post__hero">
                <Image src={post.heroImage} alt={post.title} width={1280} height={720} priority={false} />
              </div>
            )}

            <article className="blog-prose">{content}</article>
          </main>
        </div>
      </section>
      <CopyCodeButton />
    </BaseWrapper>
  )
}
