import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { pageSchema, postSchema } from '~/schema'

// Schema-only collection — never queried at runtime via getCollection/getEntry.
// Exists solely so astro check validates MDX page frontmatter against pageSchema.
const pages = defineCollection({
  loader: glob({ base: './src/pages', pattern: '**/*.mdx' }),
  schema: pageSchema,
})

const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: 'index.{md,mdx}' }),
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: postSchema,
})

const thoughts = defineCollection({
  loader: glob({
    base: './src/content/thoughts',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: postSchema,
})

export const collections = {
  pages,
  home,
  blog,
  thoughts,
}
