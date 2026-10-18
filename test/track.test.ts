import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"
import { renderToString } from "preact-render-to-string"
import LandingConstructor from "../components-local/landing/src/Landing"
import ResearchPageConstructor from "../components-local/research/src/ResearchPage"
import {
  NerRasterFigure,
  PhdAttractorFigure,
  MastersLatticeFigure,
} from "../components-local/research/src/figures"

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

// ── Task 3: landing composition (SSR renderToString with mocked props) ────

const Landing = LandingConstructor()

function renderLanding(): string {
  const props = {
    fileData: {
      slug: "index",
      frontmatter: {
        hero: {
          name: "Mike Tarlton",
          identity: "I build artificially thinking systems inspired by physics and neuroscience",
          status: "PhD candidate at OsloMet, open to research positions",
          primaryCta: {
            label: "Faculty page",
            href: "https://www.oslomet.no/en/about/employee/michaelt",
          },
          photo: "/attachments/portrait.jpg",
          photoAlt: "Mike Tarlton, portrait photo",
        },
      },
    },
    children: [],
  } as never
  return renderToString(Landing(props as never))
}

test("landing renders masthead from hero frontmatter", () => {
  const html = renderLanding()
  assert.match(html, /Mike Tarlton/)
  assert.match(html, /I build artificially thinking systems/)
  assert.match(html, /PhD candidate at OsloMet, open to research positions/)
  // CTAs: faculty page + CV download with the download attribute
  assert.match(html, /Faculty page/)
  assert.match(html, /href="\/attachments\/tarlton-cv\.pdf"[^>]*download/)
  // photo plate with alt text
  assert.match(html, /portrait\.jpg/)
  assert.match(html, /alt="Mike Tarlton, portrait photo"/)
})

test("landing renders sim mount with corner annotations (FIG. 01)", () => {
  const html = renderLanding()
  assert.match(html, /id="gr-sim-mount"/)
  assert.match(html, /FIG\. 01/)
  assert.match(html, /OSC 6/)
  assert.match(html, /30 FPS/)
  // stable data-attributes for the Task 4 renderer
  assert.match(html, /data-sim="sbf-oscillator-bank"/)
  assert.match(html, /data-sim-oscillators="6"/)
  assert.match(html, /data-sim-fps="30"/)
})

test("landing research index carries all three project questions", () => {
  const html = renderLanding()
  for (const q of [
    "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    "How does time itself emerge from the plasticity of single neurons?",
    "How do you choose the right model when inferring networks from spiking data?",
  ]) {
    assert.ok(html.includes(q), `missing project question: ${q.slice(0, 40)}...`)
  }
  // numbered rows + links to the fixed URL set
  assert.match(html, /href="\/research\/ner-2025\/"/)
  assert.match(html, /href="\/research\/phd-overview\/"/)
  assert.match(html, /href="\/research\/masters-thesis\/"/)
  assert.match(html, />01</)
  assert.match(html, />02</)
  assert.match(html, />03</)
})

test("landing cortex door links to /wiki/ with coordinate label", () => {
  const html = renderLanding()
  assert.match(html, /class="gr-door"[^>]*href="\/wiki\/"/)
  assert.match(html, /→ \/wiki\//)
})

test("landing contact band carries email + linkedin + github", () => {
  const html = renderLanding()
  assert.match(html, /mailto:M@Tarlton\.info/)
  assert.match(html, /linkedin\.com\/in\/m-tarlton/)
  assert.match(html, /github\.com\/MichaTarlton/)
})

test("NO Cortex note list anywhere on the landing", () => {
  const html = renderLanding()
  // §3/§9.4: no Cortex content on Hub pages; the door is a link only.
  assert.ok(!html.includes("Recently in the Cortex"), "Cortex note list snuck in")
  assert.ok(!html.includes("cortex-note"), "Cortex note markup snuck in")
  // no note titles/links pointing into /wiki/ notes — only the door href itself
  const wikiHrefs = [...html.matchAll(/href="\/wiki\/"/g)].length
  assert.equal(wikiHrefs, 1, "expected exactly the door link to /wiki/")
})

test("built index contains the landing bands (end-to-end pin)", () => {
  const html = readIndex()
  assert.match(html, /gr-band--masthead/)
  assert.match(html, /gr-sim-mount/)
  assert.match(html, /gr-band--research/)
  assert.match(html, /class="gr-door"/)
  assert.match(html, /gr-band--contact/)
})

// ── Task 5: research hub + project pages ──────────────────────────────────

const ResearchPage = ResearchPageConstructor()

function renderResearch(slug: string): string {
  const props = { fileData: { slug, frontmatter: {} }, children: [] } as never
  return renderToString(ResearchPage(props as never))
}

function readBuilt(rel: string): string {
  const p = path.join(root, "public", rel)
  assert.ok(fs.existsSync(p), `missing ${p} — run the build first`)
  return fs.readFileSync(p, "utf-8")
}

const threeQuestions = [
  "Can the brain's way of keeping time make machine learning cheaper at the edge?",
  "How does time itself emerge from the plasticity of single neurons?",
  "How do you choose the right model when inferring networks from spiking data?",
]

test("built /research/ hub lists all three questions, three slug links, no Cortex", () => {
  const html = readBuilt("research/index.html")
  for (const q of threeQuestions) {
    assert.ok(html.includes(q), `hub missing project question: ${q.slice(0, 40)}...`)
  }
  assert.match(html, /href="\/research\/ner-2025\/"/)
  assert.match(html, /href="\/research\/phd-overview\/"/)
  assert.match(html, /href="\/research\/masters-thesis\/"/)
  // index-table treatment: FIG. gutter numerals + boxed status badges + also lines
  assert.match(html, /FIG\. 01/)
  assert.match(html, /FIG\. 02/)
  assert.match(html, /FIG\. 03/)
  assert.match(html, /gr-hub__badge/)
  assert.match(html, /gr-hub__also/)
  // Hub page: no Cortex content (§3), and no Cortex door either here — the
  // door belongs to the landing.
  assert.ok(!html.includes("Recently in the Cortex"), "Cortex note list snuck into hub")
  assert.ok(!html.includes("cortex-note"), "Cortex note markup snuck into hub")
  // scoping: root class + page attr (beforeDOMLoaded is bundled into the
  // prescript, not inlined — assert the component static directly)
  assert.match(html, /gr-research--hub/)
  assert.match(ResearchPage.beforeDOMLoaded ?? "", /setAttribute\("data-page", "research"\)/)
})

test("built /research/ner-2025/ has FIG., Paper PDF output, and the prose article", () => {
  const html = readBuilt("research/ner-2025/index.html")
  // figure plate: FIG. label + equation-style annotation
  assert.match(html, /FIG\./)
  assert.match(html, /Δφ_i = dt \/ T_i/)
  // Outputs row: paper PDF label + link (2px-border output button)
  assert.match(html, /Paper PDF/)
  assert.match(
    html,
    /href="\/attachments\/EMBS NER 2025 - Investigation of Novel SBF-Automata Architecture for Periodicity Finding Solutions at Edge Systems - Tarlton\.pdf"/,
  )
  assert.match(html, /gr-sheet__out/)
  // header band + scoping
  assert.match(html, /SBF-Automata/)
  assert.match(html, /gr-research--project gr-research--ner-2025/)
  // Quartz renders the prose article below (component does not render content)
  assert.match(html, /<article/)
  assert.ok(
    html.includes("Periodicity finding is a critical element"),
    "paper prose body missing from built project page",
  )
})

test("built /research/phd-overview/ and /research/masters-thesis/ render their names", () => {
  const phd = readBuilt("research/phd-overview/index.html")
  assert.match(phd, /PhD Research Overview/)
  assert.match(phd, /FIG\./)
  assert.match(phd, /gr-research--phd-overview/)

  const msc = readBuilt("research/masters-thesis/index.html")
  assert.match(msc, /MSc Thesis: Model Selection for Ising Inference/)
  assert.match(msc, /FIG\./)
  assert.match(msc, /gr-research--masters-thesis/)
})

test("figures render deterministically (renderToString twice equal)", () => {
  for (const [name, Fig] of [
    ["NerRasterFigure", NerRasterFigure],
    ["PhdAttractorFigure", PhdAttractorFigure],
    ["MastersLatticeFigure", MastersLatticeFigure],
  ] as const) {
    const a = renderToString(Fig())
    const b = renderToString(Fig())
    assert.equal(a, b, `${name} output not deterministic`)
    assert.match(a, /FIG\./, `${name} missing FIG. label`)
  }
})

test("hub/project SSR is deterministic and scoped by slug", () => {
  assert.equal(renderResearch("research/index"), renderResearch("research/index"))
  assert.equal(renderResearch("research/ner-2025"), renderResearch("research/ner-2025"))
  // unknown research slugs render nothing (no invented content)
  assert.match(renderResearch("research/does-not-exist"), /^$/)
  // non-research slugs render nothing
  assert.match(renderResearch("index"), /^$/)
})

test("no legacy design-layer classes on built research pages", () => {
  for (const rel of [
    "research/index.html",
    "research/ner-2025/index.html",
    "research/phd-overview/index.html",
    "research/masters-thesis/index.html",
  ]) {
    const html = readBuilt(rel)
    for (const legacy of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
      assert.ok(!html.includes(legacy), `${rel} still contains legacy "${legacy}"`)
    }
  }
})
