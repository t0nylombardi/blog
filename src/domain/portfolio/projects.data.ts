export interface Project {
  img: string
  width: string
  title: string
  link:string
  technologies: string[]
  description: string
}


export const projects: Readonly<Project[]> = [
  {
    img: 'projects/copy_code_logo.png',
    width: 'w-[12rem]',
    title: 'Copy Code',
    link: 'https://rubygems.org/gems/copy_code',
    technologies: ['Ruby'],
    description:
      'A smart, flexible CLI tool to copy source code from a directory (or project) into your clipboard or a text file. A great tool for AI analysis.',
  },
  {
    img: '/projects/optimus-image.png',
    width: 'w-[12rem]',
    link: 'https://github.com/t0nylombardi/optimus-image',
    title: 'Optimus Image',
    technologies: ['Go'],
    description:
      'Optimus Image is a simple image optimization tool built with Go for web-ready assets, hosted on AWS EC2.',
  },
  {
    img: '/projects/churp.png',
    width: 'w-[8rem]',
    link: 'https://github.com/t0nylombardi/churp',
    title: 'Churp Social',
    technologies: ['Ruby', 'Rails', 'Redis', 'Elasticsearch', 'Docker'],
    description:
      'An attempt to bring back the original Twitter experience—without the dumpster fire.',
  },
  {
    img: '/projects/rails_template.png',
    width: 'w-[23rem]',
    link: 'https://github.com/t0nylombardi/rails_template',
    title: 'Rails Template',
    technologies: ['Ruby'],
    description:
      'A Rails bootstrap template with Docker, RSpec, Devise, Sidekiq, Active Storage, Action Text, and Tailwind.',
  },
  {
    img: '/projects/factuality.png',
    width: 'w-[23rem]',
    link: 'https://factually.wtf',
    title: 'Factuality WTF',
    technologies: ['Go', 'React', 'NextJS', 'Tailwind'],
    description:
      'A web app that serves random useless facts via a Go-powered API, deployed on AWS EC2.',
  },
];
