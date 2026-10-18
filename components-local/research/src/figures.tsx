import { nerRasterSeed } from "./projects"

/**
 * Ink-and-gold figures for the Natural research track (Task 5): one notebook
 * figure per project. Pen-and-ink line with gold wash on accents (brief §5.2.5,
 * §5.3 motifs): figures read as instrument diagrams from the notebook, not as
 * UI illustrations. Pure SVG markup, deterministic (no clock, no randomness);
 * gilding is fill/opacity only, never a text colour (pinned test). The FIG.
 * label sits in the figcaption and carries information (brief §8.4).
 */

/** Gilded corner marks crowning a figure plate (leaf on edges, aria-hidden). */
const Corners = () => (
  <>
    <span class="nat-plate__corner nat-plate__corner--tl" aria-hidden="true" />
    <span class="nat-plate__corner nat-plate__corner--tr" aria-hidden="true" />
    <span class="nat-plate__corner nat-plate__corner--bl" aria-hidden="true" />
    <span class="nat-plate__corner nat-plate__corner--br" aria-hidden="true" />
  </>
)

// ── NER 2025 · beat raster ───────────────────────────────────────────────
// Rhythms [3,6,12,24,36,48] over a 96-tick window, tick cap 24 per row (seed
// values carried from the original build). Ink tick lines on hairline rows,
// gold wash spike heads every fourth beat, hand wobble ±1px (deterministic).
const RASTER = { x0: 26, x1: 302, span: 96 }
const rasterX = (t: number) => RASTER.x0 + (t / RASTER.span) * (RASTER.x1 - RASTER.x0)

export const NerRasterFigure = () => {
  const rows = nerRasterSeed.rhythms.map((r, i) => {
    const ticks: { x: number; h: number; spike: boolean }[] = []
    for (let k = 1; k <= nerRasterSeed.tcap && k * r <= RASTER.span; k++) {
      const wobble = ((i * 7 + k * 13) % 3) - 1
      ticks.push({
        x: rasterX(k * r),
        h: 10 + (k % 2 === 0 ? 4 : 0) + wobble,
        spike: k % 4 === 0,
      })
    }
    return { r, y: 26 + i * 22, ticks }
  })
  return (
    <figure class="nat-plate nat-figplate">
      <Corners />
      <svg
        class="nat-fig"
        viewBox="0 0 320 152"
        role="img"
        aria-label="Raster of six oscillator rhythms with beat ticks and gold spike heads"
      >
        {rows.map(({ r, y, ticks }) => (
          <g key={r}>
            <line class="nat-fig__rule" x1={RASTER.x0} y1={y} x2={RASTER.x1} y2={y} />
            <text class="nat-fig__label" x={6} y={y + 3}>
              {String(r).padStart(2, "0")}
            </text>
            {ticks.map((t, k) => (
              <g key={k}>
                <line class="nat-fig__ink" x1={t.x} y1={y} x2={t.x} y2={y - t.h} />
                {t.spike && <circle class="nat-fig__wash" cx={t.x} cy={y - t.h - 3} r={2.2} />}
              </g>
            ))}
          </g>
        ))}
      </svg>
      <figcaption class="nat-fig__cap nat-mono">
        {`FIG. 01 · beat raster · rhythms ${nerRasterSeed.rhythms.join("/")} · t-cap ${
          nerRasterSeed.tcap
        }`}
      </figcaption>
    </figure>
  )
}

// ── PhD overview · attractor arcs ──────────────────────────────────────────
// Nested irregular ink orbits (the attractor basin) with a verdigris trajectory
// settling toward a gold-washed fixed point. Hand-authored wobbly control points.
export const PhdAttractorFigure = () => (
  <figure class="nat-plate nat-figplate">
    <Corners />
    <svg
      class="nat-fig"
      viewBox="0 0 240 168"
      role="img"
      aria-label="Nested attractor arcs with a verdigris trajectory settling toward a fixed point"
    >
      <path
        class="nat-fig__ink"
        d="M112 148 C 58 146 26 112 30 78 C 34 40 74 16 116 20 C 160 24 202 46 198 84 C 194 122 166 150 112 148 Z"
      />
      <path
        class="nat-fig__ink"
        d="M108 130 C 66 128 44 102 47 74 C 50 46 80 30 108 33 C 138 36 166 52 163 78 C 160 104 144 128 108 130 Z"
      />
      <path
        class="nat-fig__ink"
        d="M106 112 C 78 110 62 94 64 74 C 66 54 84 44 104 46 C 124 48 140 60 138 76 C 136 92 126 110 106 112 Z"
      />
      <path
        class="nat-fig__ink"
        d="M104 96 C 88 95 78 86 79 74 C 80 62 90 56 102 57 C 114 58 124 66 123 76 C 122 86 116 95 104 96 Z"
      />
      <path
        class="nat-fig__verdigris"
        d="M6 158 C 30 150 54 136 74 116 C 92 98 104 84 110 64 C 113 76 107 90 97 98 C 101 104 107 107 112 104 C 116 101 117 94 114 88"
      />
      <circle class="nat-fig__dot" cx={74} cy={116} r={1.6} />
      <circle class="nat-fig__dot" cx={110} cy={64} r={1.6} />
      <circle class="nat-fig__dot" cx={97} cy={98} r={1.6} />
      <circle class="nat-fig__wash" cx={112} cy={80} r={3.2} />
      <circle class="nat-fig__dot" cx={112} cy={80} r={1.2} />
    </svg>
    <figcaption class="nat-fig__cap nat-mono">
      FIG. 01 · attractor arcs · trajectory to fixed point
    </figcaption>
  </figure>
)

// ── MSc thesis · Ising lattice ─────────────────────────────────────────────
// Ink lattice of nodes and edges; the selected topology drawn in terracotta
// (a cross of one horizontal run and one vertical run), gilded wash on the
// hub node. Grid positions are pure arithmetic — deterministic by construction.
const LAT = { cols: 7, rows: 5, x0: 24, dx: 32, y0: 26, dy: 26 }
const latX = (i: number) => LAT.x0 + i * LAT.dx
const latY = (j: number) => LAT.y0 + j * LAT.dy

export const MscLatticeFigure = () => (
  <figure class="nat-plate nat-figplate">
    <Corners />
    <svg
      class="nat-fig"
      viewBox="0 0 240 160"
      role="img"
      aria-label="Ising lattice of nodes and edges with the selected topology in terracotta"
    >
      {Array.from({ length: LAT.rows }, (_, j) =>
        Array.from({ length: LAT.cols - 1 }, (_, i) => (
          <line
            key={`h-${j}-${i}`}
            class={j === 2 && i >= 1 && i <= 3 ? "nat-fig__terracotta" : "nat-fig__ink"}
            x1={latX(i)}
            y1={latY(j)}
            x2={latX(i + 1)}
            y2={latY(j)}
          />
        )),
      )}
      {Array.from({ length: LAT.rows - 1 }, (_, j) =>
        Array.from({ length: LAT.cols }, (_, i) => (
          <line
            key={`v-${j}-${i}`}
            class={i === 3 && j >= 1 && j <= 2 ? "nat-fig__terracotta" : "nat-fig__ink"}
            x1={latX(i)}
            y1={latY(j)}
            x2={latX(i)}
            y2={latY(j + 1)}
          />
        )),
      )}
      {Array.from({ length: LAT.rows }, (_, j) =>
        Array.from({ length: LAT.cols }, (_, i) => (
          <circle key={`n-${j}-${i}`} class="nat-fig__dot" cx={latX(i)} cy={latY(j)} r={2.1} />
        )),
      )}
      <circle class="nat-fig__wash" cx={latX(3)} cy={latY(2)} r={2.6} />
      <circle class="nat-fig__dot" cx={latX(3)} cy={latY(2)} r={1.4} />
    </svg>
    <figcaption class="nat-fig__cap nat-mono">
      FIG. 01 · Ising lattice · selected topology
    </figcaption>
  </figure>
)

/** Figure plate for a project slug; null when a project has no figure. */
export const figureForSlug = (slug: string) => {
  switch (slug) {
    case "ner-2025":
      return <NerRasterFigure />
    case "phd-overview":
      return <PhdAttractorFigure />
    case "masters-thesis":
      return <MscLatticeFigure />
    default:
      return null
  }
}
