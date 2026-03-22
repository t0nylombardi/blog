import type { Project } from '../types/project';

/**
 * Site Constants
 */
export const SITE_TITLE = 'T0nylombardi | Full Stack Engineer' as const;

export const SITE_DESCRIPTION = `Unlock the expertise of a self-taught,
meticulous, and motivated Full Stack Developer with over a decade of hands-on experience,
specializing in Ruby/Ruby on Rails, Javascript, Typescript, NextJS, AstroJS.
With a proven track record in e-commerce architecture, microservices, DevOps,
and team leadership, I've navigated the full stack life cycle with precision and passion.` as const;

export const ASTRO_PUBLIC_GA_ID = 'G-H56C6BEBLS' as const;

/**
 * Personal Info
 */
export const DOB = '03/31/1983' as const;
export const BIRTHDAY = new Date(1983, 2, 31);

/**
 * Types
 */
interface PersonalData {
  title: string;
  location: string;
  focus: string;
}

type SocialLinks = Record<'github' | 'linkedin' | 'twitter', string>;

type FooterSocials = Record<'twitter-bird' | 'github' | 'linkedin', string>;

/**
 * Data
 */
export const personalData: PersonalData = {
  title: 'Lead Ruby Software Engineer',
  location: 'Westchester, New York',
  focus: 'Eat, Code, Think about life choices, repeat',
};

export const socials: SocialLinks = {
  github: 'https://github.com/t0nylombardi',
  linkedin: 'https://linkedin.com/in/t0nylombardi',
  twitter: 'https://twitter.com/t0nylombardi',
};

export const footerSocials: FooterSocials = {
  'twitter-bird': 'https://twitter.com/t0nylombardi',
  github: 'https://github.com/t0nylombardi',
  linkedin: 'https://www.linkedin.com/in/anthonyjlombardi/',
};

/**
 * Projects
 */
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

/**
 * About
 */
export const aboutMe = `I am a self-taught, meticulous & motivated Full Stack Developer with 10+ years of hands-on experience,
particularly in Ruby and Ruby on Rails. I have worked on Ruby on Rails e-commerce architecture,
breaking down monoliths, working on microservices, helping with DevOps, and leading teams through
the full-stack lifecycle.

Driven by an insatiable curiosity for emerging technologies, I strive to stay at the forefront of innovation.
Every role I've taken on has contributed to my understanding of what it takes to succeed in this field,
and I carry those lessons forward continuously.`;

/**
 * UX Copy
 */
export const successMessage = `Holy s#%t, you did it! You are an absolute legend! Do you know how many people start
filling out forms and then abandon them because "ooh, shiny thing?" But not you. No, you're built different.

Your message is now embarking on a perilous journey—starting as a humble collection of 1s and 0s, traveling through
fiber optics, bouncing between data centers powered by overworked hamsters, and finally arriving in our inbox.

We'll get back to you faster than Congress passes a bill. Probably.

Go grab a snack. Google weird animal facts. Come back later.

Cheers! 🍻`;
