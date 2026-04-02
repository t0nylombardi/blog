import {codeToHast} from 'shiki'

type HastProperties = Record<string, unknown>

type HastNode = {
  type: string
  value?: string
  tagName?: string
  properties?: HastProperties
  children?: HastNode[]
}

type HastElement = HastNode & {
  type: 'element'
  tagName: string
  properties?: HastProperties
  children?: HastNode[]
}

type HastTree = {
  children?: HastNode[]
}

const languageAliases: Record<string, string> = {
  bash: 'shellscript',
  js: 'javascript',
  rb: 'ruby',
  shell: 'shellscript',
  sh: 'shellscript',
  ts: 'typescript',
  zsh: 'shellscript',
}

function isElement(node: HastNode): node is HastElement {
  return node.type === 'element'
}

function getClassNames(properties: HastProperties | undefined): string[] {
  const className = properties?.className

  if (Array.isArray(className)) {
    return className.filter((value): value is string => typeof value === 'string')
  }

  if (typeof className === 'string') {
    return className.split(/\s+/).filter(Boolean)
  }

  const classProperty = properties?.class

  if (Array.isArray(classProperty)) {
    return classProperty.filter((value): value is string => typeof value === 'string')
  }

  if (typeof classProperty === 'string') {
    return classProperty.split(/\s+/).filter(Boolean)
  }

  return []
}

function getTextContent(node: HastNode): string {
  if (node.type === 'text') {
    return node.value ?? ''
  }

  if (!node.children) {
    return ''
  }

  return node.children.map(getTextContent).join('')
}

function normalizeLanguage(language: string | undefined): string {
  if (!language) {
    return 'text'
  }

  const normalized = language.toLowerCase()
  return languageAliases[normalized] ?? normalized
}

function createFallbackCodeBlock(code: string, language: string): HastElement {
  return {
    type: 'element',
    tagName: 'pre',
    properties: {
      className: ['code-block'],
      'data-language': language,
    },
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: {
          className: [`language-${language}`],
        },
        children: [
          {
            type: 'text',
            value: code,
          },
        ],
      },
    ],
  }
}

async function highlightCodeBlock(node: HastNode): Promise<HastElement | null> {
  if (!isElement(node) || node.tagName !== 'pre' || !node.children) {
    return null
  }

  const codeNode = node.children.find((child) => isElement(child) && child.tagName === 'code')

  if (!codeNode) {
    return null
  }

  const classNames = getClassNames(codeNode.properties)
  const languageClass = classNames.find((name) => name.startsWith('language-'))
  const language = normalizeLanguage(languageClass?.replace('language-', ''))
  const code = getTextContent(codeNode)

  let highlightedPre: HastElement | null = null

  try {
    const highlighted = await codeToHast(code, {
      lang: language,
      themes: {
        light: 'catppuccin-frappe',
        dark: 'catppuccin-macchiato',
      },
      defaultColor: false,
    })

    const highlightedPreNode = highlighted.children[0] as HastNode | undefined

    if (highlightedPreNode && isElement(highlightedPreNode)) {
      highlightedPre = highlightedPreNode
    }
  } catch (error) {
    console.warn(`[rehypeShiki] Falling back to plain text for language "${language}"`, error)
  }

  if (!highlightedPre) {
    highlightedPre = createFallbackCodeBlock(code, language)
  }

  const existingClasses = getClassNames(highlightedPre.properties)

  highlightedPre.properties = {
    ...highlightedPre.properties,
    className: [...existingClasses, 'code-block'],
    'data-language': language,
  }

  return highlightedPre
}

async function transformNode(node: HastNode): Promise<void> {
  const replacement = await highlightCodeBlock(node)

  if (replacement) {
    node.type = replacement.type
    node.tagName = replacement.tagName
    node.properties = replacement.properties
    node.children = replacement.children
    node.value = replacement.value
    return
  }

  if (!node.children) {
    return
  }

  for (const child of node.children) {
    await transformNode(child)
  }
}

export function rehypeShiki() {
  return async function transformer(tree: HastTree) {
    if (!tree.children) {
      return
    }

    for (const child of tree.children) {
      await transformNode(child)
    }
  }
}
