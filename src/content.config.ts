import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectStatus = z.enum([
  'planning',
  'alpha',
  'beta',
  'live',
  'local',
  'maintenance',
  'sunset',
]);

const toolCategory = z.enum([
  'dev',
  'productivity',
  'design',
  'health',
  'fun',
  'other',
]);

const toolKind = z.enum([
  'cli',
  'web',
  'desktop',
  'api',
  'library',
]);

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
      relatedProjects: z.array(z.string()).optional(),
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

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      description: z.string(),
      status: projectStatus,
      badge: z.string().optional(),
      url: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      stack: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      screenshots: z.array(image()).optional(),
      relatedArticles: z.array(z.string()).optional(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
    }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      category: toolCategory,
      kind: toolKind,
      tags: z.array(z.string()).default([]),
      url: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      free: z.boolean().default(true),
      publishDate: z.coerce.date(),
      archived: z.boolean().default(false),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
    }),
});

export const collections = { articles, devlog, projects, tools };
