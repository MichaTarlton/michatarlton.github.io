/**
 * Hand marks & gilding primitives for the Natural landing (Task 3).
 * Ornament is structural (brief §5.2): mosaic dividers, sketch lines, imperfect
 * strokes, the door tree. All marks here are aria-hidden SVG; gold is leaf
 * (background/border/fill), never a text colour.
 */

/**
 * Thin gilded mosaic band divider: flat ornament-gold tiles with grout gaps
 * (paper shows through the gaps). Structural divider only — never a large fill,
 * never carries text. `2` = deep leaf tile, `0` = deliberate grout gap.
 */
const TILE_PATTERN: number[] = [
  1, 1, 0, 1, 2, 1, 0, 1, 1, 2, 1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1,
]

export const MosaicBand = () => (
  <div class="nat-mosaic" role="separator">
    {TILE_PATTERN.map((t, i) => (
      <span
        key={i}
        class={
          "nat-mosaic__tile" +
          (t === 2 ? " nat-mosaic__tile--deep" : t === 0 ? " nat-mosaic__tile--gap" : "")
        }
      />
    ))}
  </div>
)

/** Imperfect horizontal stroke: the sketch-line hand mark under rules/names. */
export const SketchStroke = ({ variant }: { variant?: string }) => (
  <svg
    class={`nat-handmark nat-handmark--stroke${variant ? ` nat-handmark--${variant}` : ""}`}
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 120 8"
    preserveAspectRatio="none"
  >
    <path
      d="M1 5 C 15 3, 30 6.5, 45 4 S 75 2.5, 92 5 S 112 4, 119 3.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
)

/** Rough rectangle frame: the sketch-line border around a plate. */
export const SketchFrame = () => (
  <svg
    class="nat-handmark nat-handmark--frame"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 100 40"
    preserveAspectRatio="none"
  >
    <path
      d="M0.8 1.6 C 25 0.9, 75 1.8, 99.2 1.2 M99.2 1.2 C 99.6 12, 98.7 28, 99.3 38.8 M99.3 38.8 C 70 39.6, 30 38.6, 0.9 39.2 M0.9 39.2 C 0.4 26, 1.3 12, 0.8 1.6"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
)

/** Small branching sprig: the notebook figure-plate mark inside gilded corners. */
export const SprigMark = () => (
  <svg
    class="nat-handmark nat-handmark--sprig"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 48 48"
  >
    <path
      d="M24 44 C 23.4 36, 24.4 30, 23.6 24 M23.6 24 C 19 19, 14 17, 9 11 M23.6 24 C 28 18, 32 16, 38 9 M23.6 24 C 23.2 18, 24 12, 23.4 6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <circle cx="9" cy="11" r="2" class="nat-handmark__leaf" />
    <circle cx="38" cy="9" r="2" class="nat-handmark__leaf" />
    <circle cx="23.4" cy="6" r="2" class="nat-handmark__leaf" />
  </svg>
)

/**
 * Tree-of-Life branching line for the Cortex door (brief §5.3 motif): hand
 * line-work with leaf-gold dots at the tips. The one loud ornament on the page.
 */
export const DoorTree = () => (
  <svg
    class="nat-handmark nat-door__tree"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 240 120"
  >
    <g class="nat-door__branches">
      <path d="M120 118 C 119 100, 121.5 86, 118 70" />
      <path d="M118 70 C 110 58, 97 52, 84 40" />
      <path d="M118 70 C 128 56, 142 50, 152 36" />
      <path d="M118 70 C 116.4 56, 118.4 44, 116 30" />
      <path d="M84 40 C 76.5 32, 70 26, 66 14" />
      <path d="M84 40 C 87.5 31, 92 23, 96 12" />
      <path d="M152 36 C 158.5 26, 166 20, 174 14" />
      <path d="M152 36 C 146.5 27, 144 18, 142 8" />
      <path d="M116 30 C 111.5 22, 108 16, 104 9" />
      <path d="M116 30 C 121 22, 125 16, 129 8" />
    </g>
    <g class="nat-door__leaves">
      <circle cx="66" cy="14" r="2.6" />
      <circle cx="96" cy="12" r="2.6" />
      <circle cx="104" cy="9" r="2.6" />
      <circle cx="129" cy="8" r="2.6" />
      <circle cx="142" cy="8" r="2.6" />
      <circle cx="174" cy="14" r="2.6" />
    </g>
  </svg>
)
