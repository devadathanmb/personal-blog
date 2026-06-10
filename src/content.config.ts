import { glob, file } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { pageSchema, postSchema, photoSchema } from '~/content/schema'

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

const photos = defineCollection({
  loader: file('src/content/photos/data.json'),
  schema: photoSchema,
})

export const collections = {
  pages,
  home,
  blog,
  thoughts,
  photos,
}
