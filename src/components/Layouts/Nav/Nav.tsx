import {useEffect, useRef, useState, useCallback} from 'react'
import {Routes} from '../../../routes'

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 text-2xl text-ctp-text">
      <ul className="flex flex-row justify-between min-w-full relative px-[4rem]">
        <li className="hidden px-8 py-4">
          <a href="/" className="hover:text-ctp-mauve-600 w-full">
            Anthony Lombardi
          </a>
        </li>

        <li
          id="navlinks"
          className={`${menuOpen ? 'block' : 'hidden'} lg:block lg:border-x-0 absolute lg:static top-full left-0 w-full z-50`}
        >
          <ul className="flex flex-colitems-center lg:flex-row px-8 pb-4 lg:py-4 space-y-1 lg:space-y-0 lg:space-x-8">
            {Routes.map((route) => (
              <li key={route.slug}>
                <a
                  href={route.slug}
                  className="flex items-center text-ctp-text hover:text-ctp-mauve-500"
                  onClick={() => setMenuOpen(false)}
                >
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </li>

        <li
          id="hamburger"
          className="p-2 w-fit cursor-pointer absolute right-6 top-2 lg:hidden rounded-sm"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="space-y-[0.3rem]">
            <span className={`block w-5 h-0.5 ${menuOpen ? 'bg-gray-300' : 'bg-[#7790a8]'}`} />
            <span className={`block w-5 h-0.5 ${menuOpen ? 'bg-gray-300' : 'bg-[#7790a8]'}`} />
            <span className={`block w-3 h-0.5 ml-auto ${menuOpen ? 'bg-gray-300' : 'bg-[#7790a8]'}`} />
          </div>
        </li>

        <li className="px-8 w-full text-right py-4 hidden lg:block">
          <a href="/#contact" className="text-ctp-text hover:text-ctp-mauve-500">
            _contact-me
          </a>
        </li>
      </ul>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-ctp-mantle/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  )
}
