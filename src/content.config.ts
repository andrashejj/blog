import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    base: "./content/posts",
    pattern: ["**/*.{md,mdx}", "!**/_*.{md,mdx}"],
  }),
  schema: z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slug: z.string().min(1),
    summary: z.string().min(1),
    coverImage: z.string().min(1),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    updated: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    readingTime: z.number().positive().optional(),
    canonicalUrl: z.string().url().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    base: "./content/pages",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({}),
});

export const collections = { posts, pages };
