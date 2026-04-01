import {Icon} from '@iconify/react'
import styles from './ProjectCard.module.css'

interface Props {
  img: string
  width: string
  link: string
  title: string
  technologies: string[]
  description: string
  isReversed?: boolean
}

const ProjectCard: React.FC<Props> = ({img, width, link, title, technologies, description, isReversed = false}) => {
  const cardClassName = `${styles.project}${isReversed ? ` ${styles.reverse}` : ''}`

  return (
    <div className={cardClassName}>
      {/* IMAGE */}
      <div className={styles.mediaColumn}>
        <div className={styles.projectImage}>
          <img src={img} alt={title} className={`${width} h-auto object-cover object-center rounded-md`} />
        </div>
      </div>

      {/* INFO */}
      <div className={styles.projectInfo}>
        <p className="text-xl font-bold mt-6">{title}</p>
        <p className={styles.techMeta}>Built with:// {technologies}</p>
        <p className="mt-2 px-[1rem]">{description}</p>

        {link && (
          <div className={styles.linkRow}>
            <a href={link} className="flex cursor-pointer items-center">
              <span className={styles.linkIcon}>
                <Icon icon="mdi:link-variant" className="h-6 w-6 text-green-800" />
              </span>
              <span className={styles.linkText}>{link}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
