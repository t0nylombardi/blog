import Image from 'next/image'
import Link from 'next/link'
import {type BlogPost} from '@/lib/content/schema'
import {FormattedDate} from './FormattedDate'

export function BlogCard({post}: {post: BlogPost}) {
  const imageSrc = post.image ?? post.heroImage ?? post.coverImage ?? '/avatar.jpg'

  return (
    <div className="lg:w-[25%] py-6 bg-ctp-mauve-base shadow-xl rounded-lg mx-4 my-4 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
      <Link href={`/blog/${post.slug}`} className="block">
        <Image
          className="w-full h-56 rounded-t-lg object-cover"
          src={imageSrc}
          alt={post.title}
          width={600}
          height={320}
          priority={false}
        />
        <div className="py-6 px-4 h-[16rem] drop-shadow-lg rounded-b-lg">
          <p className="text-xl text-ctp-mauve-500 font-bold">{post.title}</p>
          <p className="comment mt-1 text-sm">
            // Written at: <FormattedDate date={post.pubDate} />
          </p>
          <p className="mt-2 text-ctp-green-500 text-md">{post.description}</p>
          <div className="mt-2 text-sm text-ctp-peach-500">
            <span className="ml-3 hover:text-ctp-text">Read more</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
