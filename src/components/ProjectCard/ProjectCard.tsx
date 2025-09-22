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
    <div className="project w-full md:mx-[12rem] py-16 flex flex-col md:flex-row items-center">
      <div className="project-img block w-full md:w-auto md:flex-1 md:flex md:justify-center">
        <img
          src={img}
          className={`${width} lg:h-auto object-center object-cover md:object-cover md:object-center rounded-md`}
        />
      </div>

      <div className="project-info m-0 md:pl-16 flex-1 lg:flex-2 break-all">
        <p className="text-xl font-bold mt-6">{title}</p>
        <p className="comment text-[#7790A8] font-normal mt-1 text-sm">Built with:// {technologies}</p>
        <p className="mt-2">{description}</p>
        {link && (
          <div className="mt-2 text-sm text-[#95AAFB]">
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
