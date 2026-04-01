import {Nav} from '@/components/layout/nav'
import Footer from '@/components/layout/Footer'

export function BaseWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen overflow-hidden">
      <Nav />
      <main className="flex-1 h-screen overflow-y-scroll overflow-x-hidden hide-scrollbar px-4 sm:px-6 md:px-10 lg:px-16 snap-none md:snap-y md:snap-mandatory">
        {children}
        <Footer />
      </main>
    </div>
  )
}
