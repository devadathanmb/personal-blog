import { base } from 'astro:config/server'

/**
 * Joins the provided path segments with the base path,
 * ensuring that multiple slashes are replaced with a single slash.
 */
export function withBasePath(...paths: string[]): string {
  return [base, ...paths].join('/').replace(/\/+/g, '/')
}

/**
 * Ensures that a given pathname ends with a trailing slash.
 */
export function ensureTrailingSlash(pathname: string): string {
  return pathname.endsWith('/') ? pathname : pathname + '/'
}

/**
 * Resolves a given pathname by appending a trailing slash
 * and joining with the base path.
 */
export function resolvePath(pathname: string): string {
  return withBasePath(ensureTrailingSlash(pathname))
}

/**
 * View-transition name shared by a post's title in lists and its page heading,
 * so the title glides between the two on navigation. Must be a valid CSS ident.
 */
export function postTitleTransitionName(collection: string, id: string) {
  return `post-title-${collection}-${id}`.replace(/[^a-zA-Z0-9_-]/g, '-')
}
