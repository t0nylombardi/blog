import LanguagesSprites from '../LanguagesSprites/LanguagesSprites'
import {AboutMe} from '../../constants'
import SectionHeader from '../UI/SectionHeader'

const AboutSection = () => {
  return (
    <section
      id="about"
      className="h-screen flex justify-center items-start px-4 flex-col-reverse md:flex-row overflow-hidden"
    >
      <div className="hidden flex-1 md:flex justify-center items-center">
        <LanguagesSprites />
      </div>

      <div className="flex-1 mb-8 md:mb-0 text-start md:text-left">
        <SectionHeader header="_about-me" />
        <p className="comment mt-2">// get a small overview of who I am</p>
        <p className="mt-9">{AboutMe}</p>
      </div>
    </section>
  )
}

export default AboutSection
