import { getCollection } from 'astro:content'

import type { CollectionEntry, CollectionKey } from 'astro:content'

type CollectionEntryList<K extends CollectionKey = CollectionKey> =
  CollectionEntry<K>[]

/**
 * Ensures that a value is a positive integer.
 */
function ensurePositiveInteger(value: number, name: string) {
  if (Number.isInteger(value) && value > 0) return value
  throw new Error(
    `'${name}' must be a positive integer. Please check 'src/config.ts' for the correct configuration.`
  )
}

/**
 * Parses a tuple of boolean and number.
 */
export function parseTuple(
  tuple: boolean | [boolean, number] | undefined,
  name: string
) {
  if (!tuple || !Array.isArray(tuple) || !tuple[0]) return undefined
  return ensurePositiveInteger(tuple[1], name)
}

/**
 * Retrieves the minutes read for a post.
 */
export function getMinutesRead(
  minutesRead: number | boolean,
  computedMinutesRead: number
) {
  return minutesRead === false
    ? 0
    : typeof minutesRead === 'number' && minutesRead > 0
      ? minutesRead
      : computedMinutesRead
}

/**
 * Retrieves filtered posts from the specified content collection.
 * In production, it filters out draft posts.
 */
export async function getFilteredPosts<K extends 'blog' | 'thoughts'>(
  collection: K
): Promise<CollectionEntry<K>[]> {
  return await getCollection(collection, ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true
  })
}

/**
 * Sorts an array of posts by their publication date in descending order.
 */
export function getSortedPosts(
  posts: CollectionEntryList<'blog' | 'thoughts'>
) {
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
}


export interface SeriesNavData {
  seriesName: string
  position: number
  total: number
  prevPost: CollectionEntry<'blog'> | null
  nextPost: CollectionEntry<'blog'> | null
}

/**
 * Humanizes a slug like "intro-to-go" → "Intro to Go".
 */
function humanizeSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Returns series navigation data for a blog post, or null if the post is not
 * part of a series. A post is considered part of a series when its id contains
 * 3+ path segments (e.g. "2025/postgres/1").
 */
export function getSeriesNavigation(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[]
): SeriesNavData | null {
  const segments = currentPost.id.split('/')
  if (segments.length < 3) return null

  const seriesKey = segments.slice(0, -1).join('/')
  const seriesDir = segments[segments.length - 2]

  const seriesName =
    (currentPost.data.series && currentPost.data.series.trim()) ||
    humanizeSlug(seriesDir)

  const seriesPosts = allPosts
    .filter(
      (p) =>
        p.id.startsWith(seriesKey + '/') &&
        p.id.split('/').length === segments.length
    )
    .sort((a, b) => {
      const aOrder = a.data.order ?? Infinity
      const bOrder = b.data.order ?? Infinity
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
    })

  const position = seriesPosts.findIndex((p) => p.id === currentPost.id)
  if (position === -1) return null

  return {
    seriesName,
    position: position + 1,
    total: seriesPosts.length,
    prevPost: position > 0 ? seriesPosts[position - 1] : null,
    nextPost:
      position < seriesPosts.length - 1 ? seriesPosts[position + 1] : null,
  }
}

/**
 * Build tag relations from input shapes.
 */
export function buildTagRelations(
  input: string[][] | string[] | Record<string, string[]>
): { unique: string[]; relations: Record<string, string[]> } {
  // use Map+Set to store de-duplicated relations
  const relMap = new Map<string, Set<string>>()

  // ensure a key exists in relMap and return its Set
  const ensure = (k: string): Set<string> => {
    let set = relMap.get(k)
    if (!set) {
      set = new Set<string>()
      relMap.set(k, set)
    }
    return set
  }

  // type guard: check if an array is string[][]
  const isString2DArray = (arr: unknown[]): arr is string[][] =>
    arr.length > 0 && Array.isArray(arr[0])

  if (Array.isArray(input)) {
    if (isString2DArray(input)) {
      // string[][]: each is a post's tags
      for (const group of input) {
        const clean = Array.from(
          new Set(group.map((t) => t.trim()).filter(Boolean))
        )

        for (const a of clean) {
          const setA = ensure(a)
          for (const b of clean) {
            if (a !== b) setA.add(b)
          }
        }
      }
    } else {
      // string[] unique only
      for (const t of input) {
        ensure(String(t))
      }
    }
  } else {
    // mapping provided: each key is a tag, value is its related tags
    for (const [k, v] of Object.entries(input)) {
      const set = ensure(k)
      for (const t of v) {
        if (t && t !== k) set.add(t)
      }
    }
  }

  // collect all unique tags and sort them alphabetically
  const unique = Array.from(relMap.keys()).sort((a, b) => a.localeCompare(b))

  // convert Map<string, Set<string>> into Record<string, string[]>
  const relations: Record<string, string[]> = {}
  for (const key of unique) {
    const set = relMap.get(key)
    relations[key] = set ? Array.from(set) : []
  }

  return { unique, relations }
}
