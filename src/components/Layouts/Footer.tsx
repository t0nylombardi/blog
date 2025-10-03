import {Icon} from '@iconify/react'
import {footerSocials} from '../../constants/index'
const today = new Date()

const Footer = () => {
  return (
    <footer className="py-[2rem] my-[2rem] mx-[2rem]">
      <div className="flex flex-col justify-center items-center">
        &copy; {today.getFullYear()} Anthony Lombardi. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
