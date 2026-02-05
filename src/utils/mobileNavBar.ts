function setupHamburger() {
  const hamburger = document.querySelector('#hamburger')
  const nav = document.querySelector('#navlinks')
  const links = document.querySelectorAll('#navlinks a')

  if (!hamburger || !nav) return

  const toggle = () => {
    const isOpen = !nav.classList.contains('hidden')

    nav.classList.toggle('hidden')
    hamburger.classList.toggle('border-gray-300', !isOpen)
    hamburger.classList.toggle('border-[#7790a8]', isOpen)

    hamburger.querySelectorAll('span').forEach(bar => {
      bar.classList.toggle('bg-gray-300', !isOpen)
      bar.classList.toggle('bg-[#7790a8]', isOpen)
    })
  }

  hamburger.addEventListener('click', toggle)
  console.log("hamburger clicked")
  links.forEach(link => link.addEventListener('click', () => {
    if (!nav.classList.contains('hidden')) toggle()
  }))
}

function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
        document.querySelectorAll('.active').forEach(el => el.classList.remove('active'))

        const id = entry.target.id
        if (id) {
          document.querySelectorAll(`[href="#${id}"]`).forEach(el => el.classList.add('active'))
        }
      }
    })
  }, { threshold: 0.55 })

  const header = document.querySelector('header')
  const sections = document.querySelectorAll('section')

  if (header) observer.observe(header)
  sections.forEach(section => observer.observe(section))
}

document.addEventListener('astro:page-load', (ev) => {
  setupHamburger()

  const { pathname } = new URL((ev.target as Document).location.href)

  if (pathname === '/') {
    setupObserver()
  } else if (pathname.startsWith('/blog')) {
    document.querySelectorAll('#navlinks a').forEach(link => {
      const href = link.getAttribute('href')
      if (!href) return

      if (href.startsWith('#blog')) {
        link.setAttribute('href', '/blog')
      } else if (!href.startsWith('/')) {
        link.setAttribute('href', '/' + href)
      }
    })

    document.querySelector('[href="/blog"]')?.classList.add('active')
  }
})
