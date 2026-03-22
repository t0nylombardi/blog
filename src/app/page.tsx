import {BaseWrapper} from '@/components/layout/BaseWrapper'
import MainSection from '@/components/Sections/MainSection/MainSection'
import AboutSection from '@/components/Sections/AboutSection'
import {ContactForm} from '@/components/ContactForm'

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
