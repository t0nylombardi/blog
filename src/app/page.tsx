import {BaseWrapper} from '@components/layout/BaseWrapper'
import MainSection from '@src/components/Sections/MainSection'
import AboutSection from '@src/components/Sections/AboutSection'
import {ContactForm} from '@src/components/ContactForm'

export default function HomePage() {
  return (
    <BaseWrapper>
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll overflow-auto hide-scrollbar">
        <MainSection />
        <AboutSection />
        <ContactForm />
      </main>
    </BaseWrapper>
  )
}
