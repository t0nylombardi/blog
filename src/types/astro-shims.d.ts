declare module 'astro:content' {
  export function defineCollection(...args: any[]): any
}

declare module 'astro/loaders' {
  export function glob(...args: any[]): any
}

declare module 'astro/zod' {
  export const z: any
}
