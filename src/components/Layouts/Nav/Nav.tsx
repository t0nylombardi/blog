import {useEffect, useRef, useState, useCallback} from 'react'
import {Routes} from '../../../routes'
import '../../../utils/mobileNavBar'

export const Nav = () => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [y, setY] = useState(window.scrollY)

  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget
      if (y > window.scrollY) {
        console.log('scrolling up')
      } else if (y < window.scrollY) {
        console.log('scrolling down')
      }
      setY(window.scrollY)
    },
    [y]
  )

  useEffect(() => {
    setY(window.scrollY)
    window.addEventListener('scroll', handleNavigation)

    return () => {
      window.removeEventListener('scroll', handleNavigation)
    }
  }, [handleNavigation])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 text-2xl text-ctp-text ${
        isScrolling ? 'backdrop-blur-md bg-black/40' : 'bg-transparent backdrop-blur-0'
      }`}
    >
      <ul className="flex flex-row justify-between min-w-full relative px-[4rem]">
        <li className="px-8 py-4">
          <a href="/" className="hover:text-ctp-mauve-600">
            Anthony Lombardi
          </a>
        </li>

        <li id="navlinks" className="hidden lg:block lg:border-x-0">
          <ul className="flex flex-col lg:flex-row px-8 pb-4 lg:py-4 space-y-1 lg:space-y-0 lg:space-x-8">
            {Routes.map((route) => (
              <li className="">
                <a href={route.slug} className="flex items-center text-ctp-text hover:text-ctp-mauve-500">
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </li>

        <li id="hamburger" className="p-2 w-fit cursor-pointer absolute right-6 top-2 lg:hidden rounded-sm">
          <div className="space-y-[0.3rem]">
            <span className="block w-5 h-0.5 bg-[#7790a8]"></span>
            <span className="block w-5 h-0.5 bg-[#7790a8]"></span>
            <span className="block w-3 h-0.5 bg-[#7790a8] ml-auto"></span>
          </div>
        </li>

        <li className="px-8 py-4 hidden lg:block">
          <a href="/#contact" className="text-ctp-text hover:text-ctp-mauve-500">
            _contact-me
          </a>
        </li>
      </ul>
    </nav>
  )
}
