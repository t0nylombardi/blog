import './form-success.css'
import {motion} from 'framer-motion'
import {X} from 'lucide-react'
import BlurOverlay from './BlurOverlay'

interface SuccessPopupProps {
  onClose: () => void
}

const SuccessPopup = ({onClose}: SuccessPopupProps) => {
  return (
    <>
      <BlurOverlay onClick={onClose} />
      <motion.div
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -50}}
        transition={{duration: 0.5}}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="relative pointer-events-auto bg-blog-blue rounded-lg shadow-lg flex flex-col items-center justify-center mx-auto max-w-2xl max-h-[90vh] overflow-y-auto px-6 py-12 text-center">
          <button type="button" onClick={onClose} aria-label="Close success message" className="absolute top-2 right-2">
            <X size={30} />
          </button>
          <h1 className="mb-6">Message Successfully Executed.</h1>

          <p className="mb-4">
            Against all odds, you've successfully navigated three input fields and executed a contact form without a single
            syntax error.
          </p>

          <p className="mb-4">Your message has been dispatched into the digital void and should reach my inbox shortly.</p>

          <p>I'll get back to you as soon as I can. Until then, may your builds be green and your bugs be shallow.</p>
        </div>
      </motion.div>
    </>
  )
}

export default SuccessPopup
