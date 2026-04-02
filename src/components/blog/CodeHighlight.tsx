'use client'

import React from 'react'
import ShikiHighlighter from 'react-shiki/web'

interface CodeHighlightProps {
  code: string
  language?: string
}

const languageAliases: Record<string, string> = {
  bash: 'shellscript',
  js: 'javascript',
  rb: 'ruby',
  shell: 'shellscript',
  sh: 'shellscript',
  zsh: 'shellscript',
  ts: 'typescript',
}

const CodeHighlight = ({code, language = 'text'}: CodeHighlightProps) => {
  const normalizedLanguage = languageAliases[language.toLowerCase()] ?? language.toLowerCase()

  return (
    <ShikiHighlighter
      language={normalizedLanguage}
      className="code-block"
      theme={{
        light: 'catppuccin-frappe',
        dark: 'catppuccin-macchiato',
      }}
      showLanguage={false}
      addDefaultStyles={false}
      as="div"
      outputFormat="react"
      style={{
        textAlign: 'left',
      }}
    >
      {code.trim()}
    </ShikiHighlighter>
  )
}

export default CodeHighlight
