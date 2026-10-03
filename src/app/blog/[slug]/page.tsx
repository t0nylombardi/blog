import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {Icon} from '@iconify/react'
import {CopyCodeButton, FormattedDate, mdxComponents} from '@/components/blog'
import {BaseWrapper} from '@/components/layout'
import {getPostBySlug, getSortedPosts} from '@/lib/content/blog'
import {absoluteUrl} from '@/lib/seo'
import {siteConfig} from '@/domain/site/site.data'
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

  if (!post || (process.env.NODE_ENV === 'production' && post.draft)) {
    notFound()
  }

  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.description
  const image = post.heroImage ?? post.image ?? post.coverImage ?? siteConfig.image
  const canonical = `/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {canonical},
    robots: post.draft || post.pubDate.getTime() > Date.now() ? {index: false, follow: true} : undefined,
    authors: [{name: post.author}],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: siteConfig.name,
      locale: 'en_US',
      publishedTime: post.pubDate.toISOString(),
      modifiedTime: post.updatedDate?.toISOString(),
      authors: [post.author],
      tags: post.tags,
      url: canonical,
      images: [{url: image, alt: post.title}],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@t0nylombardi',
      site: '@t0nylombardi',
      title,
      description,
      images: [image],
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl(post.heroImage ?? post.image ?? post.coverImage ?? siteConfig.image),
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    author: {'@type': 'Person', name: post.author},
    inLanguage: 'en',
  }

  return (
    <BaseWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
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
                <Image src={post.heroImage} alt={post.title} width={1280} height={720} loading="eager" />
              </div>
            )}

            <article className="blog-prose">{content}</article>
            <div id="coffee" className="mt-4 md:mt-[8rem] blog-prose">
              <p className="my-12text-[1rem] md:text-[1.5rem]">
                If you liked this article, <br />
                please consider&nbsp;
                <a
                  href="https://www.buymeacoffee.com/t0nylombardi"
                  className="text-blog-red hover:underline hover:cursor-pointer"
                >
                  buying me a coffee
                </a>
              </p>
              <p className="my-[4rem] text-[1rem] md:text-[1.5rem]">Cheers!</p>
            </div>
          </main>
        </div>
      </section>
      <CopyCodeButton />
    </BaseWrapper>
  )
}
