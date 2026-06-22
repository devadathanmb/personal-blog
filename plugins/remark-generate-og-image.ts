import { basename, dirname } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { decode } from 'html-entities'
import satori from 'satori'
import sharp from 'sharp'
import chalk from 'chalk'

import { getCurrentFormattedTime, formatDate } from '../src/utils/datetime'
import { checkFileExistsInDir } from '../src/utils/fs'
import { ogImageMarkup } from './og-template/markup'
import backgroundBase64 from './og-template/base64'
import { FEATURES, SITE } from '../src/config'

import type { SatoriOptions } from 'satori'
import type { html } from 'satori-html'
import type { BgType } from '../src/types'
import type { OgMeta } from './og-template/markup'

const InterRegular = readFileSync('plugins/og-template/Inter-Regular-24pt.ttf')
const InterSemiBold = readFileSync(
  'plugins/og-template/Inter-SemiBold-24pt.ttf'
)
const InterBold = readFileSync('plugins/og-template/Inter-Bold-24pt.ttf')

// Site URL without protocol or trailing slash, e.g. "devadathanmb.in".
const siteUrl = SITE.website.replace(/^https?:\/\//, '').replace(/\/$/, '')

const satoriOptions: SatoriOptions = {
  // debug: true,
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Inter', weight: 400, style: 'normal', data: InterRegular },
    { name: 'Inter', weight: 600, style: 'normal', data: InterSemiBold },
    { name: 'Inter', weight: 700, style: 'normal', data: InterBold },
  ],
}

/**
 * Builds the adaptive secondary line shown under the title:
 *  - posts: "Jun 22, 2026 · 5 min read"
 *  - pages: the page subtitle
 *  - otherwise: nothing
 */
function buildSecondaryLine(frontmatter: Record<string, unknown>): string {
  const { pubDate, minutesRead, subtitle } = frontmatter

  if (pubDate) {
    try {
      const date = formatDate(pubDate as string | Date)
      return typeof minutesRead === 'number'
        ? `${date} · ${minutesRead} min read`
        : date
    } catch {
      // fall through to subtitle on an invalid date
    }
  }

  if (typeof subtitle === 'string' && subtitle.trim().length) {
    return subtitle.trim()
  }

  return ''
}

/**
 * Recursively unescapes HTML entities in a given virtual DOM node's children.
 *
 * Fix accidental HTML entity escaping in 'satori-html'.
 * @see https://github.com/natemoo-re/satori-html/issues/20#issuecomment-1999332693
 */
function unescapeHTML(node: ReturnType<typeof html>) {
  const children = node?.props?.children
  if (!children) {
    return
  } else if (Array.isArray(children)) {
    for (const n of children) {
      unescapeHTML(n)
    }
  } else if (typeof children === 'object') {
    unescapeHTML(children)
  } else if (typeof children === 'string') {
    node.props.children = decode(children)
  }
}

/**
 * Generates an Open Graph image and writes it to the specified output file.
 */
async function generateOgImage(
  authorOrBrand: string,
  title: string,
  bgType: BgType,
  output: string,
  meta: OgMeta = {}
) {
  await mkdir(dirname(output), { recursive: true })

  console.log(
    `${chalk.black(getCurrentFormattedTime())} ${chalk.green(`Generating ${output}...`)}`
  )

  try {
    const node = ogImageMarkup(authorOrBrand, title, bgType, meta)
    unescapeHTML(node)

    const svg = await satori(node, satoriOptions)

    const compressedPngBuffer = await sharp(Buffer.from(svg))
      .png({
        compressionLevel: 9,
        quality: 100,
      })
      .toBuffer()

    writeFileSync(output, compressedPngBuffer)
  } catch (e) {
    console.error(
      `${chalk.black(getCurrentFormattedTime())} ${chalk.red(`[ERROR] Failed to generate og image for '${basename(output)}'.`)}`
    )
    console.error(e)
  }
}

/**
 * Used to generate {@link https://ogp.me/ Open Graph} images.
 *
 * @see https://github.com/vfile/vfile
 */
function remarkGenerateOgImage() {
  // get config
  const ogImage = FEATURES.ogImage
  if (!(Array.isArray(ogImage) && ogImage[0])) return

  const { authorOrBrand, fallbackTitle, fallbackBgType } = ogImage[1]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return async (_tree, file) => {
    // regenerate fallback
    if (!checkFileExistsInDir('public/og-images', 'og-image.png')) {
      await generateOgImage(
        authorOrBrand,
        fallbackTitle,
        fallbackBgType,
        'public/og-images/og-image.png',
        { url: siteUrl }
      )
    }

    // check filename
    const filename = file.basename
    if (!filename || !(filename.endsWith('.md') || filename.endsWith('.mdx')))
      return

    // check draft & redirect
    const draft = file.data.astro.frontmatter.draft
    const redirect = file.data.astro.frontmatter.redirect
    if (draft || redirect) return

    // check if it need to be skipped
    const title = file.data.astro.frontmatter.title
    if (!title || !title.trim().length) return
    const ogImage = file.data.astro.frontmatter.ogImage
    if (ogImage === false) return

    // check if it has been generated
    const extname = file.extname
    const dirpath = file.dirname
    let nameWithoutExt = basename(filename, extname)
    if (nameWithoutExt === 'index') nameWithoutExt = basename(dirpath)
    if (checkFileExistsInDir('public/og-images', `${nameWithoutExt}.png`))
      return

    // check if it has been assigned & actually exists
    if (ogImage && ogImage !== true) {
      if (checkFileExistsInDir('public/og-images', basename(ogImage))) return
      console.warn(
        `${chalk.black(getCurrentFormattedTime())} ${chalk.yellow(`[WARN] The '${ogImage}' specified in '${file.path}' was not found.`)}\n  ${chalk.bold('Hint:')} Ensure the file exists in the ${chalk.cyan('public/og-images/')} directory.`
      )
      return
    }

    // get bgType — fall back if the resolved type has no static background image
    const pageBgType = file.data.astro.frontmatter.bgType
    const bgType =
      pageBgType && backgroundBase64[pageBgType as BgType]
        ? (pageBgType as BgType)
        : fallbackBgType

    // generate og images
    await generateOgImage(
      authorOrBrand,
      title.trim(),
      bgType,
      `public/og-images/${nameWithoutExt}.png`,
      {
        secondary: buildSecondaryLine(file.data.astro.frontmatter),
        url: siteUrl,
      }
    )
  }
}

export default remarkGenerateOgImage
