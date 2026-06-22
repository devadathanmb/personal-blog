import { html } from 'satori-html'
import backgroundBase64 from './base64'

import type { BgType } from '../../src/types'

const GRADIENT =
  'linear-gradient(105deg, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.58) 45%, rgba(5,5,5,0.78) 100%)'

export interface OgMeta {
  /** Secondary line under the title (e.g. "Jun 22, 2026 · 5 min read" or a page subtitle). */
  secondary?: string
  /** Site URL shown in the masthead, e.g. "devadathanmb.in". */
  url?: string
}

/**
 * Builds the Open Graph card markup.
 *
 * Constraints discovered the hard way with satori + satori-html:
 *  - satori-html (ultrahtml) escapes interpolated *markup* strings, so a
 *    conditional child like `${cond ? '<div/>' : ''}` is silently turned into
 *    text and wrecks the layout. Everything structural is therefore written
 *    inline; the only interpolations are text values and the background `src`.
 *    The optional secondary line is handled with two full templates.
 *  - Any `<div>` with siblings must declare `flex`/`contents`/`none` or satori
 *    throws — hence `flex` on the otherwise-empty scrim layer.
 */
export const ogImageMarkup = (
  authorOrBrand: string,
  title: string,
  bgType: BgType,
  meta: OgMeta = {}
) => {
  const { secondary, url } = meta

  if (secondary) {
    return html`<div
      tw="relative flex w-full h-full"
      style="font-family: 'Inter'"
    >
      <img
        tw="absolute inset-0 w-full h-full"
        src="${backgroundBase64[bgType]}"
        alt="open graph"
      />
      <div
        tw="absolute flex inset-0 w-full h-full"
        style="background: ${GRADIENT}"
      ></div>
      <div
        tw="relative flex flex-col justify-between w-full h-full"
        style="padding: 70px 84px"
      >
        <div tw="flex items-center justify-between w-full">
          <div
            tw="flex text-[#d8d8d8]"
            style="font-weight: 600; font-size: 31px; letter-spacing: 0.2px"
          >
            ${authorOrBrand}
          </div>
          <div tw="flex text-[#8a8a8a]" style="font-size: 26px">
            ${url ?? ''}
          </div>
        </div>
        <div tw="flex flex-col" style="gap: 28px">
          <div
            tw="flex text-white"
            style="font-weight: 700; font-size: 66px; line-height: 1.1; letter-spacing: -0.6px; max-width: 1010px"
          >
            ${title}
          </div>
          <div tw="flex items-center" style="gap: 20px">
            <div
              tw="flex"
              style="width: 48px; height: 4px; border-radius: 2px; background: #ffffff"
            ></div>
            <div tw="flex text-[#b3b3b3]" style="font-size: 30px">
              ${secondary}
            </div>
          </div>
        </div>
      </div>
    </div>`
  }

  return html`<div
    tw="relative flex w-full h-full"
    style="font-family: 'Inter'"
  >
    <img
      tw="absolute inset-0 w-full h-full"
      src="${backgroundBase64[bgType]}"
      alt="open graph"
    />
    <div
      tw="absolute flex inset-0 w-full h-full"
      style="background: ${GRADIENT}"
    ></div>
    <div
      tw="relative flex flex-col justify-between w-full h-full"
      style="padding: 70px 84px"
    >
      <div tw="flex items-center justify-between w-full">
        <div
          tw="flex text-[#d8d8d8]"
          style="font-weight: 600; font-size: 31px; letter-spacing: 0.2px"
        >
          ${authorOrBrand}
        </div>
        <div tw="flex text-[#8a8a8a]" style="font-size: 26px">${url ?? ''}</div>
      </div>
      <div tw="flex flex-col" style="gap: 28px">
        <div
          tw="flex text-white"
          style="font-weight: 700; font-size: 66px; line-height: 1.1; letter-spacing: -0.6px; max-width: 1010px"
        >
          ${title}
        </div>
      </div>
    </div>
  </div>`
}
