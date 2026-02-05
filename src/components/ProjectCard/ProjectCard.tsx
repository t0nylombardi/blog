import {Icon} from '@iconify/react'
import './style.css'

interface ProjectCardProps {
  img: string
  width: string
  link?: string
  title: string
  technologies: string
  description: string
  className?: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  img,
  width,
  link,
  title,
  technologies,
  description,
  className = '',
}) => {
  return (
    <div className={`project py-0 md:py-12 responsive-grid ${className}`}>
      {/* IMAGE */}
      <div className="hidden md:flex items-center">
        <div className="project-img w-full flex justify-center">
          <img src={img} alt={title} className={`${width} h-auto object-cover object-center rounded-md`} />
        </div>
      </div>

      {/* INFO */}
      <div className="project-info w-full py-12 wrap-break-word">
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
