import React from 'react'
import {ProjectCard} from '../ProjectCard'
import {Projects} from '../../constants'
import SectionHeader from '../UI/SectionHeader'

const ProjectSection = () => {
  return (
    <section id="projects" className="scroll-snap-start h-screen flex flex-col justify-center items-center my-[12rem]">
      <SectionHeader header="_projects" />
      <div>
        <div id="projects-list" className="flex flex-col justify-between w-full mt-12">
          {Projects.map((project) => (
            <ProjectCard
              img={project.img}
              width={project.width}
              link={project.link}
              title={project.title}
              technologies={project.technologies}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectSection
