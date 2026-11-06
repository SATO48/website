import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Entries are edited with Keystatic (see keystatic.config.ts); keep the two schemas in sync.
const inspirationPackages = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/inspiration-packages' }),
  schema: z.object({
    year: z.coerce.string(),
    theme: z.string(),
    // Root-relative paths into public/, e.g. /images/inspiration-packages/2026/thumbnail.jpg
    thumbnail: z.string(),
    fullSize: z.string(),
  }),
});

export const collections = { inspirationPackages };
