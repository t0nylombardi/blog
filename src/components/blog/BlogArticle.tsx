import Image from 'next/image'
import type {BlogPost} from '@/lib/content/schema'
import {renderMdx} from '@/lib/content/renderMdx'
import {blogPostStructuredData} from '@/lib/content/blogPostSeo'
import {JsonLd} from '@/components/JsonLd'
import {Breadcrumbs} from '@/components/layout/Breadcrumbs'
import {CopyCodeButton} from './CopyCodeButton'
import {FormattedDate} from './FormattedDate'
import {mdxComponents} from './MDXComponents'
import {ArticleSupport} from './ArticleSupport'
import {CalcReadingTime} from './CalcReadTime'

export async function BlogArticle({post}: {post: BlogPost}) {
  const content = await renderMdx(post.content, mdxComponents)

  return (
    <>
      <JsonLd id="article-schema" data={blogPostStructuredData(post)} />
      <section className="blog-theme">
        <div className="blog-shell">
          <main className="blog-post blog-surface">
            <Breadcrumbs
              items={[
                {name: 'Home', href: '/'},
                {name: 'Blog', href: '/blog'},
                {name: post.title, href: `/blog/${post.slug}`},
              ]}
            />
            <header className="blog-post__header">
              <h1 className="blog-post__title">{post.title}</h1>
              <p className="blog-post__description">{post.description}</p>
              <p className="blog-post__meta">
                <FormattedDate date={post.pubDate} month="long" />
                <span aria-hidden="true">·</span>
                <CalcReadingTime content={post.content} />
                <span aria-hidden="true">·</span>
                <span>{post.author}</span>
              </p>
            </header>

            {post.heroImage && (
              <div className="blog-post__hero">
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1248px) calc(96vw - 2rem), 1152px"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            )}

            <article className="blog-prose">{content}</article>
            <ArticleSupport />
          </main>
        </div>
      </section>
      <CopyCodeButton />
    </>
  )
}
