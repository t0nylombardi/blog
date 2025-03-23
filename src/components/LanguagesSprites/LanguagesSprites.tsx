import {Icon} from '@iconify/react'
import './styles.css'

const LanguagesSprites = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-wrap showcase gap-16 mt-12 justify-center">
        <Icon icon="logos:ruby" />
        <Icon icon="logos:rails" />
        <Icon icon="vscode-icons:file-type-html" />
        <Icon icon="devicon:css3" />

        <Icon icon="logos:javascript" />
        <Icon icon="logos:typescript-icon" />
        <Icon icon="logos:react" />
        <Icon icon="devicon:astro" />

        <Icon icon="logos:nodejs-icon" />
        <Icon icon="logos:postgresql" />
        <Icon icon="logos:docker-icon" />
        <Icon icon="logos:go" />

        <Icon icon="ion:logo-github" className="text-azure" />
        <div className="hidden sm:block md:hidden lg:block">
          <Icon icon="emojione:taco" />
        </div>
        <Icon icon="vscode-icons:file-type-vscode" />
        <Icon icon="vscode-icons:file-type-tailwind" />
      </div>
    </div>
  )
}

export default LanguagesSprites
