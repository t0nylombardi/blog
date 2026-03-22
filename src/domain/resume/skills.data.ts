type SkillEntry = [number, string]

type SkillCategory = {
  category: string
  skills: SkillEntry[]
}

export const SkillsWeb: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      [95, "Ruby"],
      [80, "TypeScript"],
      [45, "Go"],
      [50, "Python"],
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      [95, "Ruby on Rails"],
      [85, "React"],
      [80, "NodeJS"],
      [80, "NextJS"],
      [70, "AstroJS"],
      [50, "Django"]
    ],
  },
  {
    category: "Databases",
    skills: [
      [80, "PostgreSQL"],
      [80, "MySQL"],
      [65, "GraphQL"],
    ],
  },
  {
    category: "Cloud & Services",
    skills: [
      [75, "AWS Cognito"],
      [80, "AWS EC2"],
      [80, "AWS S3"],
      [70, "Docker"],
    ],
  },
  {
    category: "Styling",
    skills: [
      [95, "HTML/CSS"],
      [90, "Sass"],
      [70, "TailwindCSS"],
    ],
  },
  {
    category: "Testing",
    skills: [
      [80, "RSpec"],
      [70, "Cucumber"],
      [60, "Jest"],
      [60, "Cypress"],
      [60, "Plywright"],
    ],
  },
];
