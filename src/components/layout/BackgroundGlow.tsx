'use client'

import {useEffect, useRef} from 'react'

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)
const destination = () =>
  `translate(${randomBetween(-30, 30)}vw, ${randomBetween(-30, 30)}vh) scale(${randomBetween(0.8, 1.5)})`

export function BackgroundGlow() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 768px)')
    const animations = new Set<Animation>()

    const stop = () => {
      animations.forEach((animation) => {
        animation.onfinish = null
        animation.cancel()
      })
      animations.clear()
    }

    const start = () => {
      stop()
      if (reducedMotion.matches) return

      const wander = (glow: Element, from: string) => {
        const to = destination()
        const animation = glow.animate([{transform: from}, {transform: to}], {
          duration: randomBetween(3000, 6000) * (mobile.matches ? 2 : 1),
          easing: 'ease-in-out',
          fill: 'forwards',
        })
        animations.add(animation)
        animation.onfinish = () => {
          wander(glow, to)
          animations.delete(animation)
          animation.cancel()
        }
      }

      container.current?.querySelectorAll('.background-glow').forEach((glow) => {
        wander(glow, 'translate(0vw, 0vh) scale(1)')
      })
    }

    start()
    reducedMotion.addEventListener('change', start)
    return () => {
      reducedMotion.removeEventListener('change', start)
      stop()
    }
  }, [])

  return (
    <div ref={container} aria-hidden="true">
      <div className="background-glow background-glow-primary" />
      <div className="background-glow background-glow-secondary" />
    </div>
  )
}
