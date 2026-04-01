import {BaseWrapper} from '@/components/layout/BaseWrapper'
import MainSection from '@/components/sections/main/MainSection'
import AboutSection from '@/components/sections/AboutSection'
import {ContactForm} from '@/components/contact'

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
