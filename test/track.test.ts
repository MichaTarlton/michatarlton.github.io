import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"

/**
 * Track: Natural — built-output pins (Task 1).
 * Run after `npm run build:components && npx quartz build`.
 */

const publicDir = path.resolve(import.meta.dirname, "..", "public")

function read(rel: string): string {
  return fs.readFileSync(path.join(publicDir, rel), "utf-8")
}

test("public/index.html exists (run the quartz build first)", () => {
  assert.ok(
    fs.existsSync(path.join(publicDir, "index.html")),
    "public/index.html missing; run npx quartz build",
  )
})

test("landing marker present in built index", () => {
  const html = read("index.html")
  assert.match(html, /nat-/, "expected nat- landing marker class in public/index.html")
})

for (const forbidden of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
  test(`no legacy "${forbidden}" in built index`, () => {
    const html = read("index.html")
    assert.ok(!html.includes(forbidden), `public/index.html still contains "${forbidden}"`)
  })
}

// ============================================================================
// Task 2 — tokens: parsed hexes, WCAG contrast, ornament-gold pin
// ============================================================================

const stylesDir = path.resolve(import.meta.dirname, "..", "quartz", "styles")
const tokensSrc = fs.readFileSync(path.join(stylesDir, "_tokens.scss"), "utf-8")
const trackPartials = [
  "_tokens.scss",
  "_base.scss",
  "_chrome.scss",
  "_landing.scss",
  "_research.scss",
]

/** Read a `--name: #rrggbb;` value from the token sheet. */
function token(name: string): string {
  const m = tokensSrc.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`))
  assert.ok(m, `token --${name} not found in _tokens.scss`)
  return m[1].toLowerCase()
}

/** WCAG 2.1 relative luminance of #rrggbb. */
function luminance(hex: string): number {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

/** WCAG 2.1 contrast ratio between two #rrggbb colors. */
function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

const paper = token("nat-paper")
const surface = token("nat-surface")

test("token values match the ratified brief §5.3", () => {
  assert.equal(paper, "#f6f0e4")
  assert.equal(surface, "#fcf8f0")
  assert.equal(token("nat-ink"), "#22243a")
  assert.equal(token("nat-link"), "#3a4a8f")
  assert.equal(token("nat-accent-text"), "#8f5c08")
  assert.equal(token("nat-accent-mark"), "#a97b1f")
  assert.equal(token("nat-ornament-gold"), "#c9a227")
  assert.equal(token("nat-verdigris"), "#2e7d6e")
  assert.equal(token("nat-terracotta"), "#a4492e")
})

test("text tokens meet WCAG AA (>=4.5:1) on paper", () => {
  const cases: [string, string][] = [
    ["link", token("nat-link")],
    ["accent-text", token("nat-accent-text")],
    ["ink", token("nat-ink")],
  ]
  for (const [name, hex] of cases) {
    const r = contrast(hex, paper)
    assert.ok(r >= 4.5, `${name} ${hex} on paper ${paper} is ${r.toFixed(2)}:1, needs >=4.5`)
  }
})

test("link and accent-text hit their expected measured values", () => {
  // Expected: link ~7.24 on paper, accent text ~5.35 on surface (5.00 on paper).
  assert.ok(Math.abs(contrast(token("nat-link"), paper) - 7.24) < 0.05)
  assert.ok(Math.abs(contrast(token("nat-accent-text"), surface) - 5.35) < 0.05)
  assert.ok(Math.abs(contrast(token("nat-accent-text"), paper) - 5.0) < 0.05)
})

test("accent mark meets 3:1 non-text floor on paper and surface", () => {
  const mark = token("nat-accent-mark")
  assert.ok(
    contrast(mark, paper) >= 3,
    `mark ${mark} on paper ${contrast(mark, paper).toFixed(2)}:1`,
  )
  assert.ok(
    contrast(mark, surface) >= 3,
    `mark ${mark} on surface ${contrast(mark, surface).toFixed(2)}:1`,
  )
})

test("ornament gold #c9a227 never appears as a color: property in track partials", () => {
  // Gilding material only: bands, initial-cap circles, door frames. A bare
  // `color:` (not background-color/text-decoration-color) using the gold or
  // its token is a WCAG failure (2.13:1) and breaks "ornament never text".
  const offenders: string[] = []
  for (const file of trackPartials) {
    const src = fs.readFileSync(path.join(stylesDir, file), "utf-8")
    src.split("\n").forEach((line, i) => {
      if (/(^|[;{\s])color:\s*[^;]*(#c9a227|var\(--nat-ornament-gold\))/i.test(line)) {
        offenders.push(`${file}:${i + 1}: ${line.trim()}`)
      }
    })
  }
  assert.deepEqual(offenders, [], "ornament gold used as text color")
})
