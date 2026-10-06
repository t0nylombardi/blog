import {siteConfig} from '@/domain/site/site.data'
import {pageMetadata} from '@/lib/seo'
import {BaseWrapper} from '@/components/layout'
import {AboutSection, ContactForm, MainSection} from '@/components/sections'

export const metadata = {
  ...pageMetadata(siteConfig.title, siteConfig.description, '/'),
  title: {absolute: siteConfig.title},
}

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
