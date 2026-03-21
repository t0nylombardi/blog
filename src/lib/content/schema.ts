import {z} from 'zod'

const toDate = (value: unknown) => {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return value
}

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const blogFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.preprocess(toDate, z.date()).optional(),
    date: z.preprocess(toDate, z.date()).optional(),
    updatedDate: z.preprocess(toDate, z.date()).optional(),
    author: z.string().default('Tony Lombardi'),
    heroImage: z.string().optional(),
    coverImage: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    seo: seoSchema.optional(),
    images: z.array(imageSchema).default([]),
    originalDatePublished: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.pubDate && !data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Frontmatter requires either 'pubDate' or legacy 'date'.",
        path: ['pubDate'],
      })
    }
  })

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>

export type BlogPost = Omit<BlogFrontmatter, 'date'> & {
  slug: string
  content: string
  pubDate: Date
}
