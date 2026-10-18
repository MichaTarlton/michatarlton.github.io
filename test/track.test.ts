import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"

/**
 * Graphic Realism track — built-output pins + token/contrast checks.
 * Run after `npm run build:components && npx quartz build`.
 */

const root = path.resolve(import.meta.dirname, "..")
const indexPath = path.join(root, "public", "index.html")
const tokensPath = path.join(root, "quartz", "styles", "_tokens.scss")

function readIndex(): string {
  assert.ok(fs.existsSync(indexPath), `missing ${indexPath} — run the build first`)
  return fs.readFileSync(indexPath, "utf-8")
}

test("landing marker present in built index", () => {
  const html = readIndex()
  assert.match(html, /gr-landing/)
})

test("no legacy design-layer classes in built index", () => {
  const html = readIndex()
  for (const legacy of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
    assert.ok(!html.includes(legacy), `built index still contains legacy "${legacy}"`)
  }
})

// ── Task 2: tokens + WCAG contrast on the built token values ─────────────

/** Parse a `$name: #hex;` declaration out of _tokens.scss. */
function tokenHex(name: string): string {
  const src = fs.readFileSync(tokensPath, "utf-8")
  const m = src.match(new RegExp(`\\$${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`))
  assert.ok(m, `token $${name} not found in _tokens.scss`)
  return m[1]
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  assert.ok(m, `not a hex color: ${hex}`)
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

/** WCAG 2.x relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two hex colors. */
function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const tokens = {
  paper: tokenHex("paper"),
  ink: tokenHex("ink"),
  gray: tokenHex("gray"),
  link: tokenHex("link"),
  accent: tokenHex("accent"),
}

test("token hex values are the ratified brief values", () => {
  assert.equal(tokens.paper, "#f7f6f4")
  assert.equal(tokens.ink, "#16161a")
  assert.equal(tokens.gray, "#6a6a6a")
  assert.equal(tokens.link, "#1b3fd8")
  assert.equal(tokens.accent, "#e5231b")
})

test("text colors hit WCAG AA on paper", () => {
  const link = contrast(tokens.link, tokens.paper)
  const ink = contrast(tokens.ink, tokens.paper)
  const gray = contrast(tokens.gray, tokens.paper)
  assert.ok(link >= 4.5, `link on paper ${link.toFixed(2)} < 4.5`)
  assert.ok(ink >= 4.5, `ink on paper ${ink.toFixed(2)} < 4.5`)
  assert.ok(gray >= 4.5, `gray on paper ${gray.toFixed(2)} < 4.5`)
  // expected magnitudes from the brief (§4.3: link ~7:1; gray verify; ink high)
  assert.ok(Math.abs(link - 7.07) < 0.1, `link expected ≈7.07, got ${link.toFixed(2)}`)
  assert.ok(Math.abs(ink - 17) < 0.5, `ink expected ≈17, got ${ink.toFixed(2)}`)
  assert.ok(Math.abs(gray - 5.08) < 0.1, `gray expected ≈5.08, got ${gray.toFixed(2)}`)
})

test("accent hits the 3:1 non-text floor on paper", () => {
  const c = contrast(tokens.accent, tokens.paper)
  assert.ok(c >= 3, `accent on paper ${c.toFixed(2)} < 3`)
  assert.ok(Math.abs(c - 4.24) < 0.1, `accent expected ≈4.24, got ${c.toFixed(2)}`)
})

test("selection: white on accent holds AA, so ::selection is accent ground with white text", () => {
  // Task 2 selection rule: accent-red ground with white text ONLY if contrast
  // holds. Measured: white on accent = 4.58:1 ≥ 4.5 → it holds (ink on the
  // same red measures 3.94:1 and would NOT, so white is the only valid text
  // on accent ground). _base.scss ::selection accordingly uses
  // background: var(--accent) with white text — accent as ground, never as
  // text color (the pin below keeps it that way).
  assert.ok(contrast("#ffffff", tokens.accent) >= 4.5, "white on accent must pass AA")
  assert.ok(contrast(tokens.ink, tokens.accent) < 4.5, "ink on accent unexpectedly passes")
})

test("accent is never used as a text color in the track partials", () => {
  // §4.2.9: the accent marks and blocks; text is ink, gray, or Link Colour.
  // Pin: no `color: var(--accent...)` on any selector in the five partials.
  // (Mark-only uses like text-decoration-color / border-color / background /
  // outline are allowed and are not matched here.)
  const partials = ["_tokens", "_base", "_chrome", "_landing", "_research"]
  for (const name of partials) {
    const src = fs.readFileSync(path.join(root, "quartz", "styles", `${name}.scss`), "utf-8")
    const offender = src
      .split("\n")
      .findIndex((line) => /(?<![-\w])color:\s*var\(--accent\b/.test(line))
    assert.equal(offender, -1, `${name}.scss line ${offender + 1} uses accent as a text color`)
  }
})
