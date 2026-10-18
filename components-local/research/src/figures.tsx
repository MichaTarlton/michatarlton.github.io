import { nerRasterSeed } from "./projects"

/**
 * Flat annotated figures per the Graphic Realism track (brief §4.3 "Page
 * Figures"): 2px line, solid fills, FIG. labels, one accent. Pure SVG markup
 * functions — deterministic output, no runtime, no gradients/shadows.
 * Values carried from the original build: the NER raster seed (rhythms +
 * tcap); markup itself is re-implemented per track (plan, Task 5).
 */

const monoTag = "font-family: var(--codeFont); font-size: 10px; letter-spacing: 0.08em;"
const inkText = `${monoTag} fill: var(--ink);`
const grayText = `${monoTag} fill: var(--gray);`
const inkLine = "stroke: var(--ink); stroke-width: 2; fill: none;"
const accentLine = "stroke: var(--accent); stroke-width: 2; fill: none;"

/** FIG. tag in the plate's top-left corner — functional annotation (§4.2.3). */
function FigTag({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} style={inkText}>
      {text}
    </text>
  )
}

/**
 * FIG. 01 — NER raster / oscillator bank: one tick row per rhythm from the
 * carried seed, spike edges (accent) at tcap multiples, one equation-style
 * annotation. Rhythms [3,6,12,24,36,48], tcap 24.
 */
export function NerRasterFigure() {
  const { rhythms, tcap } = nerRasterSeed
  const PX = 5 // px per time unit
  const TMAX = 96
  const X0 = 88
  const Y0 = 72
  const DY = 28

  const ticks = (T: number) => {
    const out: number[] = []
    for (let t = T; t <= TMAX; t += T) out.push(X0 + t * PX)
    return out
  }
  const spikes: number[] = []
  for (let t = tcap; t <= TMAX; t += tcap) spikes.push(X0 + t * PX)

  return (
    <svg
      class="gr-fig"
      viewBox="0 0 640 260"
      role="img"
      aria-label="Oscillator bank raster: tick rows per period, spike edges at criterion-time multiples"
    >
      <FigTag x={16} y={28} text="FIG. 01" />
      {/* time axis with criterion-time labels */}
      <line x1={X0} y1={48} x2={X0 + TMAX * PX} y2={48} style={inkLine} />
      {spikes.map((x, i) => (
        <text x={x} y={40} text-anchor="middle" style={grayText}>
          {tcap * (i + 1)}
        </text>
      ))}
      {rhythms.map((T, i) => {
        const y = Y0 + i * DY
        return (
          <g key={`row-${T}`}>
            <text x={X0 - 12} y={y + 4} text-anchor="end" style={grayText}>
              T={T}
            </text>
            <g style={inkLine}>
              {ticks(T).map((x) => (
                <line x1={x} y1={y - 7} x2={x} y2={y + 7} />
              ))}
            </g>
            {/* spike edges at tcap multiples — the figure's single accent */}
            <g style={accentLine}>
              {spikes.map((x) => (
                <line x1={x} y1={y - 11} x2={x} y2={y + 11} />
              ))}
            </g>
          </g>
        )
      })}
      {/* equation-style annotation (mono, one line) */}
      <text x={16} y={246} style={grayText}>
        Δφ_i = dt / T_i
      </text>
    </svg>
  )
}

/**
 * FIG. 02 — PhD attractor arc diagram: concentric arcs + an inward
 * trajectory, 2px ink, one accent tick at the trajectory's start.
 */
export function PhdAttractorFigure() {
  const CX = 360
  const CY = 130
  const shells = [36, 64, 92, 120]

  const pt = (r: number, deg: number): [number, number] => [
    +(CX + r * Math.cos((deg * Math.PI) / 180)).toFixed(2),
    +(CY + r * Math.sin((deg * Math.PI) / 180)).toFixed(2),
  ]
  const arcPath = (r: number) => {
    const [x0, y0] = pt(r, 100)
    const [x1, y1] = pt(r, 420) // 420° ≡ 60°: the long way round (320° sweep)
    return `M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`
  }

  const trajectory: string[] = []
  for (let t = 0; t <= 720; t += 24) {
    const r = 120 - t * 0.12
    const [x, y] = pt(r, t)
    trajectory.push(`${x},${y}`)
  }
  const [sx, sy] = pt(120, 0)

  return (
    <svg
      class="gr-fig"
      viewBox="0 0 640 260"
      role="img"
      aria-label="Attractor diagram: concentric shells with a trajectory spiralling inward"
    >
      <FigTag x={16} y={28} text="FIG. 02" />
      <g style={inkLine}>
        {shells.map((r) => (
          <path d={arcPath(r)} />
        ))}
        <polyline points={trajectory.join(" ")} />
      </g>
      {/* one accent tick: trajectory start on the outer shell */}
      <rect x={sx - 4} y={sy - 4} width="8" height="8" style="fill: var(--accent)" />
      <text x={16} y={246} style={grayText}>
        {shells.length} SHELLS · 1 TRAJECTORY
      </text>
    </svg>
  )
}

/**
 * FIG. 03 — MSc lattice diagram: grid of nodes + edges (Ising lattice),
 * 2px ink; one node in the accent. Terracotta is not in GR — ink + accent only.
 */
export function MastersLatticeFigure() {
  const COLS = 6
  const ROWS = 4
  const X0 = 120
  const Y0 = 60
  const DX = 80
  const DY = 40
  const accentNode: [number, number] = [1, 3]

  const px = (j: number) => X0 + j * DX
  const py = (i: number) => Y0 + i * DY

  return (
    <svg
      class="gr-fig"
      viewBox="0 0 640 240"
      role="img"
      aria-label="Lattice diagram: grid of nodes joined by edges, one node marked"
    >
      <FigTag x={16} y={28} text="FIG. 03" />
      <g style={inkLine}>
        {Array.from({ length: ROWS }, (_, i) =>
          Array.from({ length: COLS - 1 }, (_, j) => (
            <line x1={px(j)} y1={py(i)} x2={px(j + 1)} y2={py(i)} />
          )),
        )}
        {Array.from({ length: ROWS - 1 }, (_, i) =>
          Array.from({ length: COLS }, (_, j) => (
            <line x1={px(j)} y1={py(i)} x2={px(j)} y2={py(i + 1)} />
          )),
        )}
      </g>
      <g style="fill: var(--ink)">
        {Array.from({ length: ROWS }, (_, i) =>
          Array.from({ length: COLS }, (_, j) =>
            i === accentNode[0] && j === accentNode[1] ? null : (
              <rect x={px(j) - 4} y={py(i) - 4} width="8" height="8" />
            ),
          ),
        )}
      </g>
      {/* the single accent mark */}
      <rect
        x={px(accentNode[1]) - 4}
        y={py(accentNode[0]) - 4}
        width="8"
        height="8"
        style="fill: var(--accent)"
      />
      <text x={16} y={226} style={grayText}>
        LATTICE {COLS}×{ROWS} · ISING
      </text>
    </svg>
  )
}

/** Figure lookup by project slug; null for slugs without a figure. */
export function ProjectFigure({ slug }: { slug: string }) {
  switch (slug) {
    case "ner-2025":
      return <NerRasterFigure />
    case "phd-overview":
      return <PhdAttractorFigure />
    case "masters-thesis":
      return <MastersLatticeFigure />
    default:
      return null
  }
}
