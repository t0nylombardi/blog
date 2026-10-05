import {cache} from 'react'
import {notFound} from 'next/navigation'
import {getPostBySlug} from './blog'

/** Share route visibility checks across metadata and rendering within one request. */
export const getVisiblePost = cache(async (slug: string) => {
  const post = await getPostBySlug(slug)
  if (!post || (process.env.NODE_ENV === 'production' && post.draft)) notFound()
  return post
})
