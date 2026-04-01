import React from 'react'
import ShikiHighlighter, {type Element} from 'react-shiki'

interface CodeHighlightProps {
  code: string
}

const CodeHighlight = ({code}: CodeHighlightProps) => {
  return (
    <ShikiHighlighter
      language="ruby"
      className="code-block"
      theme="catppuccin-macchiato"
      showLanguage={false}
      addDefaultStyles={false}
      as="div"
      style={{
        textAlign: 'left',
      }}
    >
      {code.trim()}
    </ShikiHighlighter>
  )
}

export default CodeHighlight
