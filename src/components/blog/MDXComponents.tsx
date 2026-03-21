import type {ImgHTMLAttributes} from 'react'
import type {MDXComponents} from 'mdx/types'
import Image from 'next/image'

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const src = props.src

  if (typeof src !== 'string' || src.length === 0) {
    return null
  }

  const alt = props.alt ?? ''
  const width = typeof props.width === 'number' ? props.width : 1200
  const height = typeof props.height === 'number' ? props.height : 675

  return <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
}
