type SocialLinks = Record<'github' | 'linkedin' | 'twitter', string>;

type FooterSocials = Record<'twitter-bird' | 'github' | 'linkedin', string>;


export const socials = {
  github: 'https://github.com/t0nylombardi',
  linkedin: 'https://linkedin.com/in/t0nylombardi',
  twitter: 'https://twitter.com/t0nylombardi',
} as const satisfies SocialLinks;

export const footerSocialLinks = {
  'twitter-bird': 'https://twitter.com/t0nylombardi',
  github: 'https://github.com/t0nylombardi',
  linkedin: 'https://www.linkedin.com/in/anthonyjlombardi/',
} as const satisfies FooterSocials;
