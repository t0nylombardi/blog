import LanguagesSprites from '../LanguagesSprites/LanguagesSprites'
import {AboutMe} from '../../constants'

const AboutSection = () => {
  return (
    <section
      id="about"
      className="h-screen flex justify-center items-center px-4 flex-col-reverse md:flex-row overflow-hidden"
    >
      <div className="flex-1 lg:flex justify-center items-center">
        <LanguagesSprites />
      </div>

      <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
        <h3 className="text-4xl font-medium">_about-me</h3>
        <p className="comment mt-2">// get a small overview of who I am</p>
        <p className="mt-9">{AboutMe}</p>
      </div>
    </section>
  )
}

export default AboutSection
