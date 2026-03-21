'use client'

import {useEffect} from 'react'

export function CopyCodeButton() {
  useEffect(() => {
    const copyButtonLabel = 'Copy Code'
    const codeBlocks = Array.from(document.querySelectorAll('article pre'))

    codeBlocks.forEach((codeBlock) => {
      if (codeBlock.querySelector('.copy-code')) return

      const wrapper = document.createElement('div')
      wrapper.style.position = 'relative'

      const copyButton = document.createElement('button')
      copyButton.className = 'copy-code'
      copyButton.innerHTML = copyButtonLabel

      codeBlock.setAttribute('tabindex', '0')
      codeBlock.appendChild(copyButton)
      codeBlock.parentNode?.insertBefore(wrapper, codeBlock)
      wrapper.appendChild(codeBlock)

      copyButton.addEventListener('click', async () => {
        const code = codeBlock.querySelector('code')
        const text = code ? code.textContent ?? '' : ''
        await navigator.clipboard.writeText(text)
        copyButton.innerText = 'Code Copied'

        setTimeout(() => {
          copyButton.innerText = copyButtonLabel
        }, 700)
      })
    })
  }, [])

  return null
}
