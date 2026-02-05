import React from 'react'
import {ProjectCard} from '../ProjectCard'
import {Projects} from '../../constants'
import SectionHeader from '../UI/SectionHeader'

const ProjectSection = () => {
  return (
    <section id="projects" className="h-screen overflow-y-scroll overflow-auto hide-scrollbar">
      <SectionHeader header="_projects" />
      <div>
        <div id="projects-list" className="">
          {Projects.map((project, index) => (
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
