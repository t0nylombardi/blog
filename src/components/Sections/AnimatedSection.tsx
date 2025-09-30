import {useRef} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'

const AnimatedSection = ({id, children}: {id: string; children: React.ReactNode}) => {
  const ref = useRef(null)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // you can tweak this
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) // parallax offset
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.section id={id} ref={ref} className="h-screen flex justify-center items-center" style={{y, opacity}}>
      {children}
    </motion.section>
  )
}

export default AnimatedSection
