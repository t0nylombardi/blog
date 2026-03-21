import {BaseWrapper} from '@components/layout/BaseWrapper'
import {ProjectSection} from '@src/components/Sections'
import {projects} from '@src/constants'

export default function ProjectsPage() {
  return (
    <BaseWrapper>
      <main className="flex-1 h-screen my-[10rem] sm:px-8">
        <ProjectSection projects={projects} />
      </main>
    </BaseWrapper>
  )
}
