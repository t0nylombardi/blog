import type {ImgHTMLAttributes} from 'react'
import type {MDXComponents} from 'mdx/types'
import {Image} from '@/components/blog/Image/Image'

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const src = props.src

  if (typeof src !== 'string' || src.length === 0) {
    return null
  }

  const alt = props.alt ?? ''
  const width = typeof props.width === 'number' ? props.width : Number.parseInt(props.width ?? '', 10) || undefined
  const height = typeof props.height === 'number' ? props.height : Number.parseInt(props.height ?? '', 10) || undefined
  const className = ['blog-inline-image', props.className].filter(Boolean).join(' ')

  return <img {...props} src={src} alt={alt} width={width} height={height} className={className} loading="lazy" />
}

export const mdxComponents: MDXComponents = {
  Image,
  img: MdxImage,
}
