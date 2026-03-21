// @ts-nocheck
// src/content/config.ts

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Shared schemas
 */
const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

/**
 * Blog collection
 */
const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),

  schema: ({ image }) =>
    z.object({
      // Core
      title: z.string().min(1),
      description: z.string().min(1),

      // Dates
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      // Author
      author: z.string().default('Tony Lombardi'),

      // Media (still using Astro image helper 👌)
      heroImage: image().optional(),
      coverImage: image().optional(),

      // Taxonomy
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),

      // Publishing
      draft: z.boolean().default(false),

      // SEO
      seo: seoSchema.optional(),
    }),
});

export const collections = {
  blog,
};
