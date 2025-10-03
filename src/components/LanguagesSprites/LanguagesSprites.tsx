import {Icon} from '@iconify/react'
import './styles.css'

const LanguagesSprites = () => {
  return (
    <div className="flex-1 flex justify-start items-center">
      <div className="flex flex-wrap showcase gap-16 mt-12 justify-center">
        <Icon icon="catppuccin:ruby" width="128" height="128" />
        <Icon icon="devicon-plain:rails" width="128" height="128" style={{color: '#91d7e3'}} />
        <Icon icon="catppuccin:typescript-react" width="128" height="128" />
        <Icon icon="catppuccin:typescript" width="128" height="128" />

        <Icon icon="catppuccin:javascript" width="128" height="128" />
        <Icon icon="catppuccin:astro" width="128" height="128" />
        <Icon icon="catppuccin:html" width="128" height="128" />
        <Icon icon="catppuccin:css" width="128" height="128" />

        <Icon icon="catppuccin:folder-node" width="128" height="128" />
        <Icon icon="catppuccin:database" width="128" height="128" />
        <Icon icon="catppuccin:docker" width="128" height="128" />
        <Icon icon="catppuccin:go" width="128" height="128" />

        <Icon icon="catppuccin:git" className="text-azure" />
        <Icon icon="catppuccin:vscode" />
        <Icon icon="catppuccin:tailwind" />

        <Icon icon="catppuccin:python" width="128" height="128" />
        <Icon icon="catppuccin:folder-aws" width="128" height="128" />
        <Icon icon="catppuccin:next" width="128" height="128" />
        <Icon icon="catppuccin:api-blueprint" width="128" height="128" />
        <Icon icon="catppuccin:pnpm" width="128" height="128" />
      </div>
    </div>
  )
}

export default LanguagesSprites
