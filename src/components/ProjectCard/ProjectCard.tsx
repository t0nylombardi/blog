import {Icon} from '@iconify/react'
import './style.css'

interface ProjectCardProps {
  img: string
  width: string
  link?: string
  title: string
  technologies: string
  description: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({img, width, link, title, technologies, description}) => {
  return (
    <div className="project flex flex-row justify-between items-center w-full">
      <div className="w-1/2 py-16 ">
        <div className="project-img w-full md:w-auto flex-1 flex justify-center">
          <img
            src={img}
            className={`${width} lg:h-auto object-center object-cover md:object-cover md:object-center rounded-md`}
          />
        </div>
      </div>

      <div className="w-1/2 project-info break-all">
        <p className="text-xl font-bold mt-6">{title}</p>
        <p className="comment text-[#7790A8] font-normal mt-1 text-sm">Built with:// {technologies}</p>
        <p className="mt-2 px-[1rem]">{description}</p>
        {link && (
          <div className="mt-2 text-mm text-[#95AAFB]">
            <a href={link} className="flex cursor-pointer items-center">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2A337E]">
                <Icon icon="mdi:link-variant" className="h-4 w-4" />
              </span>
              <span className="ml-3">{link}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
