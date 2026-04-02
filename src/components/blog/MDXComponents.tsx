import type {ComponentPropsWithoutRef, ImgHTMLAttributes, ReactElement, ReactNode} from 'react'
import {isValidElement} from 'react'
import type {MDXComponents} from 'mdx/types'
import CodeHighlight from '@/components/blog/CodeHighlight'
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

type CodeElementProps = ComponentPropsWithoutRef<'code'> & {
  children?: ReactNode
  className?: string
}

function extractCodeBlock(node: ReactNode): {code: string; language?: string} | null {
  if (!isValidElement(node)) {
    return null
  }

  const element = node as ReactElement<CodeElementProps>
  const className = element.props.className ?? ''
  const language = className.startsWith('language-') ? className.replace('language-', '') : undefined
  const codeChildren = element.props.children

  if (typeof codeChildren === 'string') {
    return {code: codeChildren, language}
  }

  if (Array.isArray(codeChildren)) {
    const code = codeChildren
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('')

    return code.length > 0 ? {code, language} : null
  }

  return null
}

function MdxPre(props: ComponentPropsWithoutRef<'pre'>) {
  const block = extractCodeBlock(props.children)

  if (!block) {
    return <pre {...props} />
  }

  return <CodeHighlight code={block.code} language={block.language} />
}

export const mdxComponents: MDXComponents = {
  Image,
  img: MdxImage,
  pre: MdxPre,
}
