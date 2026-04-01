'use client'

import {useEffect, useState} from 'react'
import {Routes} from '@/routes'
import styles from './Nav.module.css'

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
    >
      <ul className={styles.navList}>
        <li className={styles.brandItem}>
          <a href="/" className={styles.brandLink}>
            Anthony Lombardi
          </a>
        </li>

        <li className={`${styles.linksShell} ${menuOpen ? styles.linksShellOpen : ''}`}>
          <ul className={styles.linksList}>
            {Routes.map((route) => (
              <li key={route.slug}>
                <a
                  href={route.slug}
                  className={styles.navLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </li>

        <li
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className={styles.hamburgerBars}>
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
            <span className={`${styles.hamburgerBar} ${styles.hamburgerBarShort}`} />
          </div>
        </li>

        <li className={styles.contactItem}>
          <a href="/#contact" className={styles.navLink}>
            _contact-me
          </a>
        </li>
      </ul>
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  )
}
