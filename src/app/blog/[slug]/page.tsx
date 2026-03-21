import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {compileMDX} from 'next-mdx-remote/rsc'
import {BaseWrapper} from '@components/layout/BaseWrapper'
import {mdxComponents} from '@components/blog/MDXComponents'
import {CopyCodeButton} from '@components/blog/CopyCodeButton'
import {FormattedDate} from '@components/blog/FormattedDate'
import {getPostBySlug, getSortedPosts} from '@lib/content/blog'

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

  const {content} = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
    },
  })

  return (
    <BaseWrapper>
      <div className="mb-10 max-w-screen-2xl container-2xl mx-auto py-20">
        <main>
          <div className="container mx-auto">
            <div className="flex flex-col text-center w-full mt-10">
              <h1 className="text-[1.3rem] md:text-[4rem] py-4 font-medium title-font text-gray-100">{post.title}</h1>
              <div className="m-auto text-gray-100 flex flex-col justify-center">
                <h2 className="text-[1rem] md:text-[1.5rem] w-full font-thin">{post.description}</h2>
                <div className="w-full flex flex-row items-center justify-center">
                  <h4 className="text-ctp-green-500 px-[5rem] text-[0.6rem] md:text-sm font-light title-font mb-1">
                    by: {post.author} on <FormattedDate date={post.pubDate} />
                  </h4>
                </div>
              </div>
            </div>

            {post.heroImage && (
              <div className="hidden md:block my-8 md:my-16 object-contain object-center">
                <Image className="hidden w-max md:block" src={post.heroImage} alt={post.title} width={1280} height={720} />
              </div>
            )}
          </div>

          <article className="w-full mt-8 mb-8 px-[1.5rem] md:px-[4rem] text-gray-100">{content}</article>
        </main>
        <CopyCodeButton />
      </div>
    </BaseWrapper>
  )
}
