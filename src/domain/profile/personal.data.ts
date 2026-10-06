interface PersonalData {
  experience: string;
  specialty: string;
  focus: string[];
  availability: string;
}

export const DOB = '03/31/1983' as const
export const BIRTHDAY = new Date(1983, 2, 31)

export const profile: PersonalData = {
  experience: '13+ years',
  specialty: 'Full-Stack & Systems Engineering',
  focus: [
    'Software Architecture',
    'API Development',
    'Performance & Reliability',
    'Application Modernization',
  ],
  availability: 'Consulting & Contract Work',
} as const;

export const AboutMe = `I'm Anthony Lombardi, a Senior Software Engineer and technical consultant with 12+ years of professional experience building production software.
I specialize in Ruby on Rails and backend engineering, with experience spanning SaaS, fintech, real estate, e-commerce, and high-traffic consumer applications.
I've worked as both an individual contributor and engineering lead, designing backend architecture, improving performance and reliability, building APIs and integrations, mentoring engineers, and helping teams make pragmatic architectural decisions.
My consulting approach is straightforward: understand the business problem first, make the simplest technical decision that solves it well, communicate clearly, and leave the codebase better than I found it.` as const;
