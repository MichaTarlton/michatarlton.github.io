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

// ============================================================================
// Task 3 — landing composition: renderToString pins + built-output checks
// ============================================================================

import LandingComp from "../components-local/landing/src/Landing"
import { renderToString } from "preact-render-to-string"
import { projects } from "../components-local/research/src/projects"
import type { QuartzComponentProps } from "../quartz/components/types"

const Landing = LandingComp()

// Mirrors content/index.md hero frontmatter (read as-is; content stays Mike's).
const landingProps = {
  fileData: {
    slug: "index",
    frontmatter: {
      hero: {
        name: "Mike Tarlton",
        identity:
          "I build artificially thinking systems inspired by physics and neuroscience; spiking neural networks and neuro-dynamics models, groundwork for the next generation of machine intelligence.",
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
} as unknown as QuartzComponentProps

const landingHtml = renderToString(Landing(landingProps))

test("landing renders name in Fraunces with gold initial cap and identity in voice italic", () => {
  assert.ok(landingHtml.includes('class="nat-landing-name initial-cap"'))
  assert.ok(landingHtml.includes("Mike Tarlton"))
  assert.ok(landingHtml.includes('class="nat-landing-identity voice"'))
  assert.ok(landingHtml.includes("I build artificially thinking systems"))
})

test("opening band: photo plate with alt, both CTAs, mono status", () => {
  assert.ok(landingHtml.includes('class="nat-plate-photo"'))
  assert.ok(landingHtml.includes('src="/attachments/portrait.jpg"'))
  assert.ok(landingHtml.includes('alt="Mike Tarlton, portrait photo"'))
  assert.ok(landingHtml.includes('href="https://www.oslomet.no/en/about/employee/michaelt"'))
  assert.ok(landingHtml.includes("Faculty page"))
  assert.ok(landingHtml.includes('href="/attachments/tarlton-cv.pdf"'))
  assert.ok(landingHtml.includes("Download CV"))
  assert.ok(landingHtml.includes('class="nat-landing-status nat-mono"'))
  assert.ok(landingHtml.includes("PhD candidate at OsloMet"))
})

test("sim plate: FIG. 01 annotation, stable canvas mount with data attributes, no sim script", () => {
  assert.ok(landingHtml.includes("FIG. 01 · growing graph"))
  assert.ok(landingHtml.includes('id="nat-sim-canvas"'))
  assert.ok(landingHtml.includes('data-sim="tree"'))
  assert.ok(landingHtml.includes('data-sim-seed="tarlton-nat"'))
  assert.ok(landingHtml.includes('data-sim-tick="33"'))
  assert.ok(landingHtml.includes('class="nat-plate nat-sim-plate"'))
  assert.ok(landingHtml.includes('class="nat-handmark nat-handmark--frame"'))
  // gilded corner marks: four of them on the sim plate
  const cornerMarks = landingHtml.match(/nat-plate__corner/g) ?? []
  assert.ok(cornerMarks.length >= 4, "sim plate should have gilded corner marks")
  // Task 4 supersedes the old "no sim logic" pin: the mount script now exists,
  // inlined as a string static and guarded on the single mount id.
  assert.ok(typeof Landing.afterDOMLoaded === "string" && Landing.afterDOMLoaded.length > 0)
  assert.ok(Landing.afterDOMLoaded.includes("nat-sim-canvas"), "mount guard present")
  assert.ok(Landing.afterDOMLoaded.includes("addCleanup"), "SPA idempotent teardown registered")
})

test("featured research spreads: all three questions, blurb, marginalia placeholder, status, links", () => {
  for (const p of projects) {
    assert.ok(landingHtml.includes(p.q), `missing question for ${p.slug}`)
    assert.ok(landingHtml.includes(`/research/${p.slug}/`), `missing link for ${p.slug}`)
    assert.ok(landingHtml.includes(p.name), `missing name for ${p.slug}`)
    assert.ok(landingHtml.includes(p.status), `missing status for ${p.slug}`)
  }
  // one-line blurbs present (first words of each)
  assert.ok(landingHtml.includes("I transposed the striatal beat-frequency model"))
  // clearly-marked placeholder marginalia (brief §9.5)
  assert.ok(landingHtml.includes("[placeholder marginalia]"))
  // also items
  assert.ok(landingHtml.includes("Oscillatory Timing Models in RL-Automata (AAMAS 2024)"))
  assert.ok(landingHtml.includes("Experiencing a Slice of the Sky"))
})

test("Cortex door: exactly ONE door element (class pin), no Cortex note list", () => {
  const doors = landingHtml.match(/class="nat-door"/g) ?? []
  assert.equal(doors.length, 1, "exactly one loud-ornament door on landing")
  assert.ok(landingHtml.includes('href="/wiki/"'))
  assert.ok(landingHtml.includes("The Cortex"))
  assert.ok(landingHtml.includes("nat-door__tree"))
  // No Cortex content on hub pages (brief §3): no fake note lists
  assert.ok(!landingHtml.includes("Recently in the Cortex"))
  assert.ok(!landingHtml.includes("nat-cortex-list"))
})

test("contact band: email, LinkedIn, GitHub", () => {
  assert.ok(landingHtml.includes("mailto:M@Tarlton.info"))
  assert.ok(landingHtml.includes("M@Tarlton.info"))
  assert.ok(landingHtml.includes("https://www.linkedin.com/in/m-tarlton/"))
  assert.ok(landingHtml.includes("https://github.com/MichaTarlton"))
})

test("mosaic dividers: thin gilded band separators between sheet bands", () => {
  const bands = landingHtml.match(/class="nat-band /g) ?? []
  assert.equal(bands.length, 5, "five sheet bands (opening, sim, research, door, contact)")
  const dividers = landingHtml.match(/class="nat-mosaic"/g) ?? []
  assert.equal(dividers.length, 4, "four mosaic dividers between five bands")
})

test("hand mark on every band: each band contains a hand mark or marginal note", () => {
  const split = landingHtml.split('class="nat-band ')
  // split[0] is the wrapper; bands follow
  const bands = split.slice(1)
  assert.equal(bands.length, 5)
  for (const [i, band] of bands.entries()) {
    const hasMark =
      band.includes("nat-handmark") ||
      band.includes("nat-spread__margin") ||
      band.includes("nat-door__tree")
    assert.ok(hasMark, `band ${i} lacks a hand mark`)
  }
})

test("built index.html carries the landing composition", () => {
  const html = read("index.html")
  assert.ok(html.includes("nat-landing"))
  assert.ok(html.includes("FIG. 01 · growing graph"))
  assert.ok(html.includes("nat-sim-canvas"))
  assert.ok(html.includes('class="nat-door"'))
  assert.ok(html.includes("mailto:M@Tarlton.info"))
  // exactly one door in built output too
  const doors = html.match(/class="nat-door"/g) ?? []
  assert.equal(doors.length, 1)
})

// ============================================================================
// Task 5 — research hub + project pages: plate album, covers, ink-and-gold figures
// ============================================================================

import ResearchComp from "../components-local/research/src/Research"
import {
  NerRasterFigure,
  PhdAttractorFigure,
  MscLatticeFigure,
} from "../components-local/research/src/figures"
import { also, nerRasterSeed } from "../components-local/research/src/projects"

const Research = ResearchComp()

const hubProps = {
  fileData: {
    slug: "research/index",
    frontmatter: {
      description:
        "Mike Tarlton's research: brain-inspired learning systems, from models of neural timing to model selection for spiking networks. Grouped by question, not by paper.",
    },
  },
} as unknown as QuartzComponentProps

const nerProps = {
  fileData: { slug: "research/ner-2025/index", frontmatter: {} },
} as unknown as QuartzComponentProps

const hubHtml = renderToString(Research(hubProps) as any)
const nerHtml = renderToString(Research(nerProps) as any)

test("hub: plate album lists all three questions, names, statuses, and slug links", () => {
  assert.ok(hubHtml.includes('class="nat-research nat-research-hub"'))
  for (const p of projects) {
    assert.ok(hubHtml.includes(p.q), `missing question for ${p.slug}`)
    assert.ok(hubHtml.includes(p.name), `missing name for ${p.slug}`)
    assert.ok(hubHtml.includes(p.status), `missing status for ${p.slug}`)
    assert.ok(hubHtml.includes(`href="/research/${p.slug}/"`), `missing link for ${p.slug}`)
  }
  // questions in the voice register; status as soft mono pill
  assert.ok(hubHtml.includes('class="nat-album__q voice"'))
  assert.ok(hubHtml.includes('class="nat-badge nat-mono"'))
  // gilded corner marks on mounted plates
  assert.ok(hubHtml.includes('class="nat-plate__corner nat-plate__corner--tl"'))
  // a hand mark somewhere in the hub (sketch stroke under the title)
  assert.ok(hubHtml.includes("nat-handmark"))
  // also items below, with the external one flagged
  for (const a of also) assert.ok(hubHtml.includes(a.label))
})

test("hub: NO Cortex content (brief §3)", () => {
  assert.ok(!hubHtml.includes("Cortex"))
  assert.ok(!hubHtml.includes("nat-door"))
  assert.ok(!hubHtml.includes("nat-cortex"))
})

test("project: cover header, outputs row, figure plate — rendered via dispatcher", () => {
  assert.ok(nerHtml.includes('class="nat-research nat-research-project"'))
  assert.ok(nerHtml.includes("SBF-Automata"))
  assert.ok(nerHtml.includes('class="nat-badge nat-mono"'))
  assert.ok(nerHtml.includes("Principal author, spotlight poster at IEEE NER 2025"))
  assert.ok(nerHtml.includes('class="nat-cover__q voice"'))
  assert.ok(nerHtml.includes("Paper PDF"))
  assert.ok(nerHtml.includes("FIG. 01 · beat raster"))
  // raster seed values present: rhythms + tcap
  assert.ok(nerHtml.includes(`rhythms ${nerRasterSeed.rhythms.join("/")}`))
  assert.ok(nerHtml.includes(`t-cap ${nerRasterSeed.tcap}`))
  // hand mark on the project cover slab too
  assert.ok(nerHtml.includes("nat-handmark"))
})

test("dispatcher: project slugs match after stripping trailing /index (cross-lane fix)", () => {
  // The T1 bug: slug 'research/<slug>/index' never matched the project branch.
  for (const p of projects) {
    const html = renderToString(
      Research({
        fileData: { slug: `research/${p.slug}/index`, frontmatter: {} },
      } as unknown as QuartzComponentProps) as any,
    )
    assert.ok(html.includes(p.name), `project page for ${p.slug} rendered nothing`)
    assert.ok(html.includes("nat-cover__slab"), `project page for ${p.slug} missing cover slab`)
  }
  // Non-research slugs render nothing.
  assert.equal(Research({ fileData: { slug: "cv", frontmatter: {} } } as any), null)
})

test("figures: deterministic — renderToString twice yields identical markup", () => {
  for (const Figure of [NerRasterFigure, PhdAttractorFigure, MscLatticeFigure]) {
    const a = renderToString(Figure() as any)
    const b = renderToString(Figure() as any)
    assert.equal(a, b)
    assert.ok(a.includes("FIG."), "figure carries its FIG. label")
    assert.ok(a.includes("nat-plate__corner"), "figure plate has a gilded corner")
  }
  // track-specific accents
  assert.ok(renderToString(PhdAttractorFigure() as any).includes("nat-fig__verdigris"))
  assert.ok(renderToString(MscLatticeFigure() as any).includes("nat-fig__terracotta"))
  assert.ok(renderToString(NerRasterFigure() as any).includes("nat-fig__wash"))
})

test("gold pin: _research.scss never uses ornament gold or accent mark as a text color", () => {
  const src = fs.readFileSync(path.join(stylesDir, "_research.scss"), "utf-8")
  const offenders: string[] = []
  src.split("\n").forEach((line, i) => {
    if (
      /(^|[;{\s])color:\s*[^;]*(#c9a227|#a97b1f|var\(--nat-ornament-gold\)|var\(--nat-accent-mark\))/i.test(
        line,
      )
    ) {
      offenders.push(`_research.scss:${i + 1}: ${line.trim()}`)
    }
  })
  assert.deepEqual(offenders, [], "gilding used as text color in _research.scss")
})

test("hub engine suppression: scoped strictly to body[data-slug=research/index]", () => {
  const src = fs.readFileSync(path.join(stylesDir, "_research.scss"), "utf-8")
  assert.ok(
    src.includes('body[data-slug="research/index"] .page-listing'),
    "engine folder listing must be hidden on the hub only",
  )
  assert.ok(
    src.includes('body[data-slug="research/index"] .center > .popover-hint > article'),
    "empty hub content article must be hidden, scoped to the hub slug",
  )
  // and nowhere else: no unscoped page-listing suppression
  const unscoped = src
    .split("\n")
    .some((l) => /\.page-listing\s*[,{]/.test(l) && !l.includes("data-slug"))
  assert.ok(!unscoped, "page-listing suppression must stay scoped to the hub slug")
})

test("built /research/index.html: album, questions, slug links, no Cortex content", () => {
  const html = read("research/index.html")
  for (const p of projects) {
    assert.ok(html.includes(p.q), `built hub missing question for ${p.slug}`)
    assert.ok(html.includes(`/research/${p.slug}/`), `built hub missing link for ${p.slug}`)
  }
  assert.ok(!html.includes("The Cortex"))
  assert.ok(!html.includes("nat-door"))
  assert.ok(!html.includes("nat-cortex"))
})

test("built /research/ner-2025/index.html: FIG., paper PDF output, prose article present", () => {
  const html = read("research/ner-2025/index.html")
  assert.ok(html.includes("FIG."), "figure label present")
  assert.ok(html.includes("Paper PDF"), "paper PDF output present")
  assert.ok(html.includes(".pdf"), "paper PDF href present")
  // Quartz still renders the authored prose below (component renders no content)
  assert.ok(
    html.includes("Periodicity finding is a critical element"),
    "article prose from content must remain",
  )
  assert.ok(html.includes('class="nat-cover__slab"'))
})

test("built phd-overview + masters-thesis render their names and figures", () => {
  const phd = read("research/phd-overview/index.html")
  assert.ok(phd.includes("PhD Research Overview"))
  assert.ok(phd.includes("FIG. 01 · attractor arcs"))
  const msc = read("research/masters-thesis/index.html")
  assert.ok(msc.includes("MSc Thesis: Model Selection for Ising Inference"))
  assert.ok(msc.includes("FIG. 01 · Ising lattice"))
  // external thesis link flagged with ↗
  assert.ok(msc.includes("↗"))
})

test("built research pages keep the hand mark and no legacy classes", () => {
  for (const rel of [
    "research/index.html",
    "research/ner-2025/index.html",
    "research/phd-overview/index.html",
    "research/masters-thesis/index.html",
  ]) {
    const html = read(rel)
    assert.ok(html.includes("nat-research"), `${rel}: research component mounted`)
    assert.ok(html.includes("nat-handmark"), `${rel}: hand mark present`)
    for (const forbidden of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
      assert.ok(!html.includes(forbidden), `${rel} still contains "${forbidden}"`)
    }
  }
})
