import LanguagesSprites from '../LanguagesSprites/LanguagesSprites'
import {AboutMe} from '../../constants'
import SectionHeader from '../UI/SectionHeader'

function AboutSection() {
  return (
    <section
      id="about"
      className="h-screen snap-start scroll-mt-20 flex justify-center items-center px-4 flex-col-reverse md:flex-row overflow-hidden"
    >
      <div className="w-1/2 hidden md:flex justify-start items-center">
        <LanguagesSprites />
      </div>

      <div className="w-1/2 mb-8 md:mb-0 text-start md:text-left">
        <SectionHeader header="_about-me" />
        <p className="comment mt-2 text-ctp-text">// get a small overview of who I am</p>
        <p className="mt-9 text-lg text-ctp-green-500">{AboutMe}</p>
      </div>
    </section>
  )
}

export default AboutSection
