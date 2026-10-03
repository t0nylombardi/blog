import {pageMetadata} from '@/lib/seo'
import {BaseWrapper} from '@/components/layout'
import {ProjectSection} from '@/components/sections'
import {projects} from '@/domain/portfolio/projects.data'

export const metadata = pageMetadata(
  'Software Engineering Projects',
  'Explore Anthony Lombardi’s software projects, including web applications, developer tools, and open source work.',
  '/projects',
)

export default function ProjectsPage() {
  return (
    <BaseWrapper>
      <main className="flex-1 h-screen my-[10rem] sm:px-8">
        <h1 className="sr-only">Software Engineering Projects</h1>
        <ProjectSection projects={projects} />
      </main>
    </BaseWrapper>
  )
}
