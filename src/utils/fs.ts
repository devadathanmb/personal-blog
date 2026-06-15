import { join } from 'node:path'
import { existsSync } from 'node:fs'

/**
 * Checks if a file exists in a specified directory.
 * Path is relative to the current working directory.
 * (`public/og-images` is equivalent to `./public/og-images`)
 */
export function checkFileExistsInDir(path: string, filename: string): boolean {
  return existsSync(join(process.cwd(), path, filename))
}
