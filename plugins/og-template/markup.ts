import { readFileSync } from 'node:fs'
import { html } from 'satori-html'
import backgroundBase64 from './base64'

import type { BgType } from '../../src/types'

// Embedded as an <img> data URI sized via `style`: satori-html passes
// width/height attributes through as strings, which Satori rejects, so an
// inline <svg> (or an attribute-sized <img>) gets dropped from the card.
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(
  readFileSync('src/assets/logo.svg', 'utf8').replace('currentColor', '#fff')
).toString('base64')}`

export const ogImageMarkup = (
  authorOrBrand: string,
  title: string,
  bgType: BgType,
  meta: string
) => {
  return html`<div
    tw="relative flex justify-center items-center w-full h-full"
    style="font-family: 'Inter'"
  >
    <img
      tw="absolute inset-0 w-full h-full"
      src="${backgroundBase64[bgType]}"
      alt="open graph"
    />

    <div tw="flex items-center justify-start w-full px-18" style="gap: 20px">
      <img
        tw="self-start"
        src="${logoDataUri}"
        alt=""
        style="width: 110px; height: 70px; min-width: 110px"
      />

      <div tw="flex flex-col" style="gap: 14px">
        <div tw="text-[#858585] text-2.1rem">${authorOrBrand}</div>
        <div
          tw="text-white text-3.4rem leading-tight mr-18"
          style="font-weight: 700"
        >
          ${title}
        </div>
        <div tw="text-[#6b6b6b] text-1.6rem mt-2">${meta}</div>
      </div>
    </div>
  </div>`
}
