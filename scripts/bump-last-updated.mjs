#!/usr/bin/env node
// Bumps `<LastUpdated date="YYYY-MM-DD" />` to today's date on any staged MDX
// page that uses the widget.
//
// Wired into lint-staged (see package.json), so it runs at commit time against
// exactly the files being committed — for any editor, not just Claude Code —
// and lint-staged re-stages whatever it changes. It no-ops when the date is
// already today or the page has no <LastUpdated> tag, so committing an
// unrelated page never produces spurious diffs.

import { readFileSync, writeFileSync } from 'node:fs'

// Local date (not UTC) so a late-night commit in IST doesn't roll to tomorrow.
const now = new Date()
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')

// The `date="..."` attribute inside a <LastUpdated ...> tag. `[^>]*?` spans
// other props and line breaks within the tag, so multi-prop / multi-line usages
// and multiple widgets per file are all handled.
const DATE_IN_TAG = /(<LastUpdated\b[^>]*?\bdate=")\d{4}-\d{2}-\d{2}(")/g

let failed = false

for (const file of process.argv.slice(2)) {
  let src
  try {
    src = readFileSync(file, 'utf8')
  } catch {
    continue // staged file vanished before the hook ran; nothing to bump
  }

  const next = src.replace(DATE_IN_TAG, `$1${today}$2`)
  if (next === src) continue

  try {
    writeFileSync(file, next)
  } catch (err) {
    console.error(`bump-last-updated: failed to write ${file}: ${err.message}`)
    failed = true
  }
}

process.exit(failed ? 1 : 0)
