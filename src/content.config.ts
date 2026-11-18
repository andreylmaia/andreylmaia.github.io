import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { labIds, pillars } from './lib/site';

export const resourceTypes = ['books','tools','articles','research','frameworks','podcasts','people','resources'] as const;
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const common = {
  id: slug, slug, title: z.string().min(1), description: z.string().min(1),
  locale: z.enum(['en', 'pt']), tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false), draft: z.boolean().default(true),
  coverImage: z.string().optional(),
};
export const collections = {
  insights: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights', generateId: ({entry}) => entry }),
    schema: z.object({ ...common, category: z.enum(pillars), relatedLabs: z.array(z.enum(labIds)).default([]), publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional() }),
  }),
  library: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/library', generateId: ({entry}) => entry }),
    schema: z.object({ ...common, category: z.enum(resourceTypes), creator: z.string().min(1), commentary: z.string().optional(),
      externalUrl: z.url({protocol:/^https?$/}) }),
  }),
};
