import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    heroImage: z.string().optional(), // path under public/, without the base
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
    // Present when the post is a Data in Motion project; drives the Projects page.
    project: z
      .object({
        question: z.string(),
        finding: z.string(),
        category: z.enum(["real", "curiosity", "overengineered"]),
        tools: z.array(z.string()),
        status: z.enum(["published", "in-progress"]),
      })
      .optional(),
  }),
});

export const collections = { blog };
