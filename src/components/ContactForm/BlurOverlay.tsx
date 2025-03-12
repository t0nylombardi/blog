import React from 'react'
import {motion} from 'framer-motion'

interface BlurOverlayProps {
  onClick: () => void
}

export default function BlurOverlay({onClick}: BlurOverlayProps) {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.6}}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClick}
    />
  )
}
