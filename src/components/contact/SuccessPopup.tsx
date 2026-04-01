import React from 'react'
import {motion} from 'framer-motion'
import {X} from 'lucide-react'
import BlurOverlay from './BlurOverlay'

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
        <div className="bg-blog-blue text-[#e5e9f0] px-6 py-4 rounded-lg shadow-lg w-[60rem] flex flex-col relative">
          <button onClick={onClose} className="absolute top-2 right-2">
            <X size={30} className="text-[#e5e9f0] hover:opacity-80 transition-opacity" />
          </button>
          <h3 className="text-6xl font-medium mb-5">_success</h3>

          <p className="text-lg font-medium text-[#e5e9f0] my-4">
            It is a dark time for the digital galaxy. Across the vast expanse of the internet, countless forms lay
            abandoned, half-filled and forgotten, victims of distraction and doubt. The great Squirrel Distraction
            Plague continues to claim would-be heroes, leading them astray before they can complete their sacred duty.
          </p>
          <p className="text-lg font-medium text-[#e5e9f0] my-4">
            Yet, in the depths of cyberspace, a lone warrior emerges... you.
          </p>
          <p className="text-lg font-medium text-[#e5e9f0] my-4">
            Defying all odds, you faced the Fields of Mandatory Input, braved the Checkbox of Infinite Bureaucracy, and
            conquered the Captcha of the Unreadable Hieroglyphs. Others before you have faltered, surrendering to the
            cursed "I'll finish this later" mentality—but not you. No, you are built different.
          </p>
          <p className="text-lg font-medium text-[#e5e9f0] my-4">
            Somewhere, in a hidden fortress of inboxes, a signal appears—a humble collection of 1s and 0s forged in the
            fires of commitment. It stands tall, proud, awaiting its moment to be read. The guardians of the inbox shall
            respond, faster than a cheetah on an espresso shot, or at least faster than Congress passing a bill.
          </p>
          <p className="text-lg font-medium text-[#e5e9f0] my-4">
            Until then, celebrate this victory. Take a moment to bask in your achievement. Revel in the knowledge that
            you have done what so many could not. You have completed the form. You have submitted the contact. You have
            taken the first step on a journey that will lead you to the stars.
          </p>
          <p className="text-lg font-medium text-[#e5e9f0] my-4">The reply is coming. Soon.</p>
        </div>
      </motion.div>
    </>
  )
}
