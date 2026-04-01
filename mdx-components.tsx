import type {MDXComponents} from 'mdx/types'
import {mdxComponents} from '@/components/blog'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  }
}
