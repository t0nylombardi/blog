import React from 'react'

interface CodeInputProps {
  id: string
  name: string
  type: 'text' | 'email'
  value: string
  placeholder?: string
  autoComplete: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CodeInput = ({id, name, type, value, placeholder, autoComplete, onChange}: CodeInputProps) => {
  const ctxLength = value || placeholder || ''
  const width = Math.max(ctxLength.length, 1)

  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-label={name}
      required
      value={value}
      onChange={onChange}
      size={1}
      style={{
        width: `${width}ch`,
        minWidth: '1ch',
      }}
      className="
        col-start-1 row-start-1
        shrink-0
        border-0
        focus:outline-none
        box-content
        align-baseline
        w-full min-w-0
        bg-transparent
        border-none
        outline-none
        focus:ring-0
        p-0 m-0
        text-ctp-green-500
        placeholder:text-ctp-green-500/40
        font-mono
        caret-white
      "
    />
  )
}
export default CodeInput
