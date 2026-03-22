import type {JSX} from 'react'
import {ProjectCard} from '@/components/ProjectCard'
import SectionHeader from '@/components/UI/SectionHeader'
import type {Project} from '@/domain/portfolio/projects.data'

interface Props {
  projects: ReadonlyArray<Project>
}
const ProjectSection = ({projects}: Props): JSX.Element => {
  return (
    <section id="projects" className="h-screen overflow-y-scroll overflow-auto hide-scrollbar">
      <SectionHeader header="_projects" />
      <div>
        <div id="projects-list" className="">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              img={project.img}
              width={project.width}
              link={project.link}
              title={project.title}
              technologies={project.technologies}
              description={project.description}
              className={index % 2 === 1 ? 'project--reverse' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectSection
