import {Icon} from '@iconify/react'
import {footerSocials} from '../../constants/index'
const today = new Date()

const Footer = () => {
  console.log(footerSocials)
  return (
    <footer className="flex flex-col justify-center items-center py-[2rem] px-[1rem] mb-[3rem] text-white">
      &copy; {today.getFullYear()} Anthony Lombardi. All rights reserved.
      <div className="social-links min-w-full h-full bg-pink-500 md:w-auto flex justify-around gap-6 mt-12 ">
        {Object.entries(footerSocials).map(([platform, url]) => {
          return (
            <div className="text-md text-white" key={platform}>
              <a href={url} className="text-lg text-white" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">T0nylombardi's {platform.toUpperCase()}</span>
                <Icon icon="fa7-brands:linkedin-in" width="448" height="512" />
                <p>{platform}</p>
              </a>
            </div>
          )
        })}
      </div>
    </footer>
  )
}

export default Footer
