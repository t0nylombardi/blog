import {siteConfig} from '@/domain/site/site.data'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function loadGtag() {
  if (window.dataLayer) return

  const gtagId = siteConfig.gaId
  const gtagUrl = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`

  const script = document.createElement('script')
  script.src = gtagUrl
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(p0?: string, p1?: any) {
    window.dataLayer.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', gtagId)
}
