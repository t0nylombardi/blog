import type {MDXComponents} from 'mdx/types'
import {mdxComponents} from './src/components/blog/MDXComponents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  }
}
