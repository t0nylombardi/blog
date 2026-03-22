interface PersonalData {
  title: string;
  location: string;
  focus: string;
}

export const DOB = '03/31/1983' as const
export const BIRTHDAY = new Date(1983, 2, 31)

export const profile: PersonalData = {
  title: 'Lead Ruby Software Engineer',
  location: 'Westchester, New York',
  focus: 'Eat, Code, Think about life choices, repeat',
} as const;

export const AboutMe = `I am a self-taught, meticulous & motivated Full Stack Developer with 10+ years of hands-on experience,
particularly in Ruby and Ruby on Rails. I have worked on Ruby on Rails e-commerce architecture,
breaking down monoliths, working on microservices, helping with DevOps, and leading teams through
the full-stack lifecycle.

Driven by an insatiable curiosity for emerging technologies, I strive to stay at the forefront of innovation.
Every role I've taken on has contributed to my understanding of what it takes to succeed in this field,
and I carry those lessons forward continuously.` as const;
