import {BaseWrapper} from '@/components/layout'
import {AboutSection, MainSection} from '@/components/sections'
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
