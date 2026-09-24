import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import researchScript from "./researchScript"

/**
 * Research hub + project-page prototype (ticket 08), on the chosen system.
 * Follows the ratified model of ticket 07 (entity model, card anatomy, project
 * header order, status vocabulary). Two presentation variants per page type,
 * switchable with `?variant=` / the prototype bar:
 *   Hub A "Ledger"  — essay-led, single-column card list
 *   Hub B "Two-up"  — section bands, 2-col card grid, one-line intro
 *   Page A "Header band"  — type then full-width Page Figure (07 literal)
 *   Page B "Figure cover" — type sits on the Page Figure slab
 * Real Figure art is ticket 16; static subject-matched placeholders here.
 * The full paper body renders below via Quartz prose.
 */

export function isResearchSlug(slug: string): boolean {
  return slug === "research/index" || slug.startsWith("research/")
}

interface Output {
  label: string
  href: string
}

interface Project {
  n: string
  slug: string
  name: string
  status: string
  venue: string
  year: string
  q: string
  meta: string
  blurb: string
  summary: string
  outputs: Output[]
  fig: JSX.Element
}

// ── Page Figure placeholders (static, deterministic; real art is ticket 16) ──
const ink = "currentColor"

function rasterFigure(rhythms: number[], tcap: number): JSX.Element {
  const rows = rhythms.map((r, i) => {
    const ticks = []
    for (let t = 1; t <= 300; t += r) {
      const h = 10 + ((i * 37 + t) % 14)
      ticks.push(<line key={t} x1={t * 0.66} y1={14 + i * 14} x2={t * 0.66} y2={14 + i * 14 + h} />)
    }
    return (
      <g key={i} opacity={0.85}>
        {ticks}
      </g>
    )
  })
  const edges = []
  for (let t = tcap; t <= 300; t += tcap) {
    edges.push(
      <g key={t}>
        <line
          x1={t * 0.66}
          y1={14 + rhythms.length * 14}
          x2={t * 0.66}
          y2={14 + rhythms.length * 14 + 8}
          opacity={0.5}
        />
        <path
          d={`M ${t * 0.66 - 3} ${14 + rhythms.length * 14 + 12} L ${t * 0.66} ${14 + rhythms.length * 14 + 5} L ${t * 0.66 + 3} ${14 + rhythms.length * 14 + 12}`}
          stroke-width="1.2"
        />
      </g>,
    )
  }
  const tcol = tcap * 0.66 + 4
  return (
    <svg viewBox="0 0 200 80" fill="none" stroke={ink} stroke-width="1.4" stroke-linecap="round">
      <line x1="0" y1="78" x2="200" y2="78" opacity="0.3" />
      {rows}
      {edges}
      <line x1={tcol} y1="6" x2={tcol} y2="78" stroke-dasharray="2 3" opacity="0.4" />
      <text
        x={tcol + 2}
        y="70"
        fill={ink}
        stroke="none"
        font-size="5"
        font-family="var(--codeFont)"
      >
        T_C
      </text>
    </svg>
  )
}

function attractorFigure(): JSX.Element {
  const points = []
  for (let i = 0; i < 260; i++) {
    const a = i * 0.075
    const x = 100 + 74 * Math.cos(a) * (0.5 + 0.5 * Math.sin(a * 0.35))
    const y = 40 + 30 * Math.sin(a * 2) * Math.cos(a * 0.8)
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  for (let i = 0; i < 90; i++) {
    const a = i * 0.22 + 1.9
    const x = 100 + 60 * Math.cos(a) * (0.5 + 0.5 * Math.cos(a * 0.5))
    const y = 40 + 24 * Math.sin(a * 1.7)
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 200 80" fill="none" stroke={ink} stroke-width="1" stroke-linecap="round">
      <line x1="0" y1="78" x2="200" y2="78" opacity="0.3" />
      <path d={`M ${points.join(" L ")}`} />
    </svg>
  )
}

function latticeFigure(): JSX.Element {
  const up = (x: number, y: number, o: number) => (
    <path
      key={`${x}-${y}`}
      d={`M ${x} ${y} l ${o} ${-6} l ${-o - 1} ${-6.5} Z`}
      fill={ink}
      stroke="none"
      opacity={0.75}
    />
  )
  const down = (x: number, y: number, o: number) => (
    <path
      key={`${x}-${y}`}
      d={`M ${x} ${y} l ${-o} ${6} l ${o + 1} ${6.5} Z`}
      fill={ink}
      stroke="none"
      opacity={0.4}
    />
  )
  const figs = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const x = 24 + c * 40
      const y = 20 + r * 22 + (c % 2) * 6
      figs.push(up(x, y, 5), down(x + 12, y + 12, 5))
    }
  }
  return (
    <svg viewBox="0 0 200 80" fill="none" stroke={ink} stroke-width="1.2" stroke-linecap="round">
      <line x1="0" y1="78" x2="200" y2="78" opacity="0.3" />
      {figs}
    </svg>
  )
}

const projects: Project[] = [
  {
    n: "01",
    slug: "ner-2025",
    name: "SBF-Automata",
    status: "Published",
    venue: "Principal author · Spotlight poster · IEEE NER 2025 · San Diego",
    year: "2025",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata · IEEE NER 2025",
    blurb:
      "I transposed the striatal beat-frequency model into a reinforcement-learning automaton that learns intervals online, encoded directly in its weights, and showed it works at the edge in O(N) localized updates — no central clock, no global error signal.",
    summary:
      "Periodicity finding is a workload the brain does for free and machines do expensively. I built a reinforcement-learning automaton from the striatal beat-frequency model of interval timing: a bank of oscillating units whose weights learn which periodicities predict reward, updating locally and online. Against FFT, autocorrelation and Autoperiod, SBF-A matched or beat them in speed, stability and accuracy — in O(N) per update, suited to neuromorphic edge hardware.",
    outputs: [
      {
        label: "Paper PDF",
        href: "/attachments/EMBS NER 2025 - Investigation of Novel SBF-Automata Architecture for Periodicity Finding Solutions at Edge Systems - Tarlton.pdf",
      },
    ],
    fig: rasterFigure([3, 6, 12, 24, 36, 48], 24),
  },
  {
    n: "02",
    slug: "phd-overview",
    name: "PhD Research Overview",
    status: "In progress",
    venue: "PhD candidate · Artificial intelligence · Oslo Metropolitan University",
    year: "2022–",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD Research · OsloMet",
    blurb:
      "My doctoral programme designs learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics — for online, always-on, low-energy learning machines.",
    summary:
      "Biological brains compute with time — spike intervals, synchrony, oscillations — and artificial networks largely ignore it. My PhD asks whether the brain's time-based mechanisms can become practical learning rules: spike-timing plasticity as a learning signal, oscillator-based computation, and temporal structure that emerges from the plasticity of individual neurons. The goal is machine learning that is online, always-on, and radically low-energy.",
    outputs: [
      { label: "Poster", href: "/research/ner-2025/" },
      { label: "Essay", href: "/wiki/" },
    ],
    fig: attractorFigure(),
  },
  {
    n: "03",
    slug: "masters-thesis",
    name: "MSc Thesis — Model Selection for Ising Inference",
    status: "Published",
    venue: "M.Sc. neuroscience · Kavli Institute, NTNU · Roudi group",
    year: "2021",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc Thesis · Kavli Institute, NTNU",
    blurb:
      "I derived and tested an information-based Bayesian criterion for choosing among Ising-model networks when inferring connectivity from neural spiking — designed, simulated, and evaluated on HPC clusters.",
    summary:
      "Record a population of neurons and you can ask how its cells are connected — but every answer depends on the model you choose to infer with: too simple misses structure, too complex fits noise. My thesis evaluated a novel information-based Bayesian criterion for exactly this choice, across candidate Ising-model topologies, simulated at scale on NTNU's IDUN cluster.",
    outputs: [
      {
        label: "Thesis PDF",
        href: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2783337?locale-attribute=en",
      },
    ],
    fig: latticeFigure(),
  },
]

const also = [
  {
    label: "Oscillatory Timing Models in RL-Automata (AAMAS 2024)",
    meta: "Poster · PDF",
    href: "/attachments/aamas-2024-oscillatory-timing-models.pdf",
  },
  {
    label:
      "Experiencing a Slice of the Sky: Immersive Rendering and Sonification of Antarctic Astronomy Data",
    meta: "Mixed-media installation · xREZ Art + Science Lab, UNT",
    href: "https://doi.org/10.2352/ISSN.2470-1173.2018.03.ERVR-449",
  },
]

// ── Hub ───────────────────────────────────────────────────────
const fmtName = (s: string) => s.slice(0, 1) + s.slice(1).toLowerCase()
const fmtSlug = (s: string) => s.replace(/-/g, " ")

const SectionCard = ({ p }: { p: Project }) => (
  <a class="r-card" href={`/research/${p.slug}/`}>
    <div class="r-card-top">
      <span class="r-n">{p.n}</span>
      <span class={`r-badge${p.status === "Published" ? " r-badge-solid" : ""}`}>{p.status}</span>
    </div>
    <div class="r-fig">{p.fig}</div>
    <h3 class="q">{p.q}</h3>
    <p class="r-meta">{p.meta}</p>
    <p class="r-blurb">{p.blurb}</p>
  </a>
)

const Lede = () => (
  <p class="r-lede">
    The work on this page is grouped by the questions it tries to answer, not by the papers it
    produced. I work where neuroscience meets machine learning: taking how the brain keeps time and
    uses it to learn, and transposing it into rules for machines that learn online, always on.
  </p>
)

const SectionHead = ({ kicker, line }: { kicker: string; line: string }) => (
  <div class="r-section-head">
    <p class="kicker accent">{kicker}</p>
    <p class="r-route">{line}</p>
  </div>
)

const AlsoList = () => (
  <section class="r-also">
    <div class="section-head">
      <h2>Also</h2>
    </div>
    <ul>
      {also.map((a) => (
        <li key={a.href}>
          <a href={a.href}>{a.label}</a>
          <span class="r-also-meta">{a.meta}</span>
        </li>
      ))}
    </ul>
    <a class="r-door" href="/wiki/">
      Enter the Cortex <span aria-hidden="true">→</span>
    </a>
  </section>
)

const HubA = () => (
  <div class="research variant-a hub-a" data-variant-name="Ledger">
    <p class="kicker accent">Research</p>
    <h1 class="display">Research</h1>
    <Lede />
    <section class="r-group">
      <SectionHead
        kicker="01 · Time"
        line="The brain tracks intervals and rhythms at every scale; I study how that timing machinery can become learning rules for machines."
      />
      <div class="r-stack">
        <SectionCard p={projects[0]} />
        <SectionCard p={projects[1]} />
      </div>
    </section>
    <section class="r-group">
      <SectionHead
        kicker="02 · Model selection"
        line="Inferring a network from its activity means choosing a model; my master's work tested a principled criterion for that choice."
      />
      <div class="r-stack">
        <SectionCard p={projects[2]} />
      </div>
    </section>
    <AlsoList />
  </div>
)

const HubB = () => (
  <div class="research variant-b hub-b" data-variant-name="Two-up">
    <p class="kicker accent">Research</p>
    <h1 class="display">Research</h1>
    <p class="r-lede r-lede-short">
      The work below is grouped by the questions it answers, not the papers it produced.
    </p>
    <section class="r-band">
      <div class="r-band-grid" aria-hidden="true" />
      <div class="r-band-inner">
        <p class="kicker accent">01 · Time</p>
        <h2 class="q">Time, learned by machines</h2>
        <div class="r-grid">
          <SectionCard p={projects[0]} />
          <SectionCard p={projects[1]} />
        </div>
      </div>
    </section>
    <section class="r-band">
      <div class="r-band-grid" aria-hidden="true" />
      <div class="r-band-inner">
        <p class="kicker accent">02 · Model selection</p>
        <h2 class="q">Reading structure out of data</h2>
        <div class="r-grid">
          <SectionCard p={projects[2]} />
        </div>
      </div>
    </section>
    <AlsoList />
  </div>
)

// ── Project page ──────────────────────────────────────────────
const ProjectA = ({ p }: { p: Project }) => (
  <div class="research variant-a page-a" data-variant-name="Header band">
    <p class="r-breadcrumb">Research · {p.n}</p>
    <header class="r-head">
      <h1 class="display">{p.name}</h1>
      <p class="r-q">{p.q}</p>
      <div class="r-meta-row">
        <span>{p.venue}</span>
        <span class="r-dot" aria-hidden="true">
          ·
        </span>
        <span>{p.year}</span>
        <span class={`r-badge${p.status === "Published" ? " r-badge-solid" : ""}`}>{p.status}</span>
      </div>
    </header>
    <div class="r-fig r-fig-wide">
      {p.fig}
      <span class="r-fig-cap">
        Page Figure — static frame. Real per-page figures land in a later ticket.
      </span>
    </div>
    <div class="r-outputs">
      <p class="kicker">Outputs</p>
      <div class="r-pills">
        {p.outputs.map((o) => (
          <a class="pill pill-link" href={o.href} key={o.label}>
            {o.label}
          </a>
        ))}
      </div>
    </div>
    <p class="r-summary">{p.summary}</p>
  </div>
)

const ProjectB = ({ p }: { p: Project }) => (
  <div class="research variant-b page-b" data-variant-name="Figure cover">
    <div class="r-cover">
      <div class="r-band-grid" aria-hidden="true" />
      <div class="r-cover-inner">
        <p class="r-breadcrumb">Research · {p.n}</p>
        <header class="r-head">
          <h1 class="display">{p.name}</h1>
          <p class="r-q">{p.q}</p>
          <div class="r-meta-row">
            <span>{p.venue}</span>
            <span class="r-dot" aria-hidden="true">
              ·
            </span>
            <span>{p.year}</span>
            <span class={`r-badge${p.status === "Published" ? " r-badge-solid" : ""}`}>
              {p.status}
            </span>
          </div>
        </header>
        <div class="r-fig">{p.fig}</div>
        <span class="r-fig-cap">
          Page Figure — static frame. Real per-page figures land in a later ticket.
        </span>
      </div>
    </div>
    <div class="r-sheet">
      <div class="r-outputs">
        <p class="kicker">Outputs</p>
        <div class="r-pills">
          {p.outputs.map((o) => (
            <a class="pill pill-link" href={o.href} key={o.label}>
              {o.label}
            </a>
          ))}
        </div>
      </div>
      <p class="r-summary">{p.summary}</p>
    </div>
  </div>
)

const Bar = () => (
  <div class="proto-bar" role="toolbar" aria-label="Prototype controls">
    <button class="pv" data-dir="-1" aria-label="Previous variant">
      ‹
    </button>
    <span class="proto-label">…</span>
    <button class="pv" data-dir="1" aria-label="Next variant">
      ›
    </button>
    <a class="proto-theme" href="#" title="Toggle light/dark" aria-label="Toggle light/dark">
      ◐
    </a>
  </div>
)

const ResearchPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (!isResearchSlug(slug)) return null

  let body: JSX.Element | null = null
  if (slug === "research/index") {
    body = (
      <>
        <HubA />
        <HubB />
      </>
    )
  } else {
    const p = projects.find((proj) => slug.startsWith(`research/${proj.slug}`))
    if (p) {
      body = (
        <>
          <ProjectA p={p} />
          <ProjectB p={p} />
        </>
      )
    }
  }

  if (!body)
    return (
      <div class="research variant-a">
        <p class="r-breadcrumb">Research</p>
        <h1 class="display">
          {fmtName(fmtSlug(slug.replace("research/", "").replace("/index", "")))}
        </h1>
      </div>
    )

  return (
    <>
      {body}
      <Bar />
    </>
  )
}

ResearchPage.beforeDOMLoaded = `(function(){
  // PROTOTYPE: light is the design; force light on research pages unless ?dark.
  var p=new URLSearchParams(location.search);
  if(!p.has("dark")){localStorage.setItem("theme","light");document.documentElement.setAttribute("saved-theme","light");}
  var v=p.get("variant"); if(v!=="a"&&v!=="b"){v="a";var u=new URL(location.href);u.searchParams.set("variant",v);history.replaceState(null,"",u.toString());}
  document.documentElement.setAttribute("data-variant",v);
})();`

ResearchPage.afterDOMLoaded = researchScript

export default (() => ResearchPage) satisfies QuartzComponentConstructor
