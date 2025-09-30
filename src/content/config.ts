// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Define a `type` and `schema` for each collection
const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
		description: z.string(),
		heroImage: z.string().optional(),
    date: z.coerce.date(),
    coverImage: z.string().optional(),
    originalDatePublished: z.coerce.date().optional(),
    author: z.string().default('Anonymous'),
    image: z.string(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    draft: z.boolean(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }).optional(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'blog': blogCollection,
};
