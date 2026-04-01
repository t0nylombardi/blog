import {cache} from 'react'
import type {ElementType} from 'react'
import {evaluate} from '@mdx-js/mdx'
import type {MDXComponents} from 'mdx/types'
import * as runtime from 'react/jsx-runtime'

type MDXModule = {
  default: ElementType<{components?: MDXComponents}>
}

const evaluateMdx = cache(async (source: string): Promise<MDXModule> => {
  return evaluate(source, runtime) as Promise<MDXModule>
})

export async function renderMdx(source: string, components: MDXComponents) {
  const {default: Content} = await evaluateMdx(source)
  return <Content components={components} />
}
