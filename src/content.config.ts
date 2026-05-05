import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const toolStatus = z.enum(['live', 'beta', 'coming-soon', 'sunset']);
const toolPricing = z.enum(['free', 'open-source', 'paid', 'source-available']);
const toolCategory = z.enum(['saas', 'cli', 'web-app', 'utility', 'library']);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      ogImage: z.string().optional(),
      relatedTools: z.array(z.string()).optional(),
      canonical: z.string().url().optional(),
    }),
});

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/devlog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      publishDate: z.coerce.date(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      project: z.string().optional(),
      heroImage: image().optional(),
    }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      description: z.string(),
      status: toolStatus,
      pricing: toolPricing,
      category: toolCategory,
      url: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      pricingUrl: z.string().url().optional(),
      stack: z.array(z.string()).default([]),
      heroImage: image().optional(),
      screenshots: z.array(image()).optional(),
      relatedArticles: z.array(z.string()).optional(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { articles, devlog, tools };
