import Image from 'next/image'
import Link from 'next/link'
import {type BlogPost} from '@/lib/content/schema'
import {FormattedDate} from './FormattedDate'

export function BlogCard({post}: {post: BlogPost}) {
  const imageSrc = post.image ?? post.heroImage ?? post.coverImage ?? '/avatar.jpg'

  return (
    <article className="blog-card blog-surface">
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <Image
          className="blog-card__image"
          src={imageSrc}
          alt={post.title}
          width={600}
          height={320}
          priority={false}
        />
        <div className="blog-card__body">
          <h2 className="blog-card__title">{post.title}</h2>
          <p className="blog-card__meta">
            // Written at: <FormattedDate date={post.pubDate} />
          </p>
          <p className="blog-card__description">{post.description}</p>
          <p className="blog-card__cta">Read more</p>
        </div>
      </Link>
    </article>
  )
}
