import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Emmanuel Guerra'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { blog };
