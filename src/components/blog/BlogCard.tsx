import Image from 'next/image'
import Link from 'next/link'
import {type BlogPost} from '@/lib/content/schema'
import {FormattedDate} from './FormattedDate'
import styles from './BlogCard.module.css'

export function BlogCard({post}: {post: BlogPost}) {
  const imageSrc = post.image ?? post.heroImage ?? post.coverImage ?? '/avatar.jpg'

  return (
    <div className={styles.card}>
      <Link href={`/blog/${post.slug}`} className={styles.link}>
        <Image
          className={styles.image}
          src={imageSrc}
          alt={post.title}
          width={600}
          height={320}
          priority={false}
        />
        <div className={styles.content}>
          <p className={styles.title}>{post.title}</p>
          <p className={styles.meta}>
            // Written at: <FormattedDate date={post.pubDate} />
          </p>
          <p className={styles.description}>{post.description}</p>
          <div className={styles.readMoreRow}>
            <span className={styles.readMore}>Read more</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
