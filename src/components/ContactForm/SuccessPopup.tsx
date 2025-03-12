import React from 'react'
import {motion} from 'framer-motion'
import {X} from 'lucide-react'
import BlurOverlay from './BlurOverlay'
import {SuccessMessage} from '../../constants'

interface SuccessPopupProps {
  onClose: () => void
}

export default function SuccessPopup({onClose}: SuccessPopupProps) {
  return (
    <>
      {/* Background Blur Overlay */}
      <BlurOverlay onClick={onClose} />

      {/* Popup Container */}
      <motion.div
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -50}}
        transition={{duration: 0.5}}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-blog-blue text-[#e5e9f0] px-6 py-4 rounded-lg shadow-lg w-[60rem] flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-2 right-2">
            <X size={20} className="text-[#e5e9f0] hover:opacity-80 transition-opacity" />
          </button>
          <h3 className="text-6xl font-medium mb-5">_success</h3>
          <p className="text-lg font-medium text-[#e5e9f0] mt-2">
            {SuccessMessage.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </p>
        </div>
      </motion.div>
    </>
  )
}
