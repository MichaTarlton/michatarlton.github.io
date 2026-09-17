import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import landingScript from "./landingScript"

/**
 * PROTOTYPE — landing page variants for the redesign map, ticket 05.
 * Three structurally different landings on the real `/` route, switched by
 * `?variant=a|b|c` (default a) and a floating bottom bar. Fold the winner into
 * a proper component and move this file to a throwaway branch when the ticket
 * resolves. Renders only on the index page.
 */

interface HeroCopy {
  name?: string
  identity?: string
  status?: string
  thinking?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

// Placeholder content — real material lands in ticket 06.
const research = [
  {
    n: "01",
    href: "/research/ner-2025/",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata · IEEE NER 2025",
    blurb:
      "A reinforcement-learning architecture transposed from the striatal beat-frequency model: online periodicity learning encoded directly in synaptic weights, built for neuromorphic edge hardware.",
    status: "Published",
    fig: (
      <svg viewBox="0 0 200 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="10" y1="70" x2="190" y2="70" opacity="0.35" />
        <line x1="24" y1="70" x2="24" y2="34" />
        <line x1="48" y1="70" x2="48" y2="52" />
        <line x1="72" y1="70" x2="72" y2="18" />
        <line x1="96" y1="70" x2="96" y2="44" />
        <line x1="120" y1="70" x2="120" y2="58" />
        <line x1="144" y1="70" x2="144" y2="26" />
        <line x1="168" y1="70" x2="168" y2="52" />
        <circle cx="72" cy="12" r="4" fill="currentColor" stroke="none" />
        <circle cx="144" cy="20" r="4" fill="currentColor" stroke="none" opacity="0.55" />
      </svg>
    ),
  },
  {
    n: "02",
    href: "/research/phd-overview/",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD Research · OsloMet",
    blurb:
      "Designing learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics — for online, always-on, low-energy learning.",
    status: "In progress",
    fig: (
      <svg viewBox="0 0 200 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M0 34 Q 25 8 50 34 T 100 34 T 150 34 T 200 34" />
        <path d="M0 46 Q 25 26 50 46 T 100 46 T 150 46 T 200 46" opacity="0.6" />
        <path d="M0 58 Q 25 44 50 58 T 100 58 T 150 58 T 200 58" opacity="0.35" />
      </svg>
    ),
  },
  {
    n: "03",
    href: "/research/masters-thesis/",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc Thesis · Kavli Institute, NTNU",
    blurb:
      "An information-based Bayesian criterion for inferring Ising-model networks from neural spiking activity — designed, simulated, and evaluated on HPC clusters.",
    status: "Thesis",
    fig: (
      <svg viewBox="0 0 200 80" fill="currentColor">
        <path d="M28 18 l6 10 h-12 z" /><path d="M58 30 l-6 -10 h12 z" opacity="0.4" /><path d="M88 18 l6 10 h-12 z" opacity="0.4" /><path d="M118 30 l-6 -10 h12 z" /><path d="M148 18 l6 10 h-12 z" opacity="0.4" /><path d="M178 30 l-6 -10 h12 z" />
        <path d="M28 48 l-6 10 h12 z" opacity="0.4" /><path d="M58 40 l6 10 h-12 z" /><path d="M88 48 l-6 10 h12 z" /><path d="M118 40 l6 10 h-12 z" opacity="0.4" /><path d="M148 48 l-6 10 h12 z" /><path d="M178 40 l6 10 h-12 z" opacity="0.4" />
      </svg>
    ),
  },
]

const recent = [
  { t: "Striatal beat-frequency model", d: "Sep 12", m: "sapling" },
  { t: "Ising-model network inference", d: "Sep 9", m: "tree" },
  { t: "Neuromorphic edge hardware", d: "Sep 3", m: "seedling" },
  { t: "Spike-timing-dependent plasticity", d: "Aug 28", m: "sapling" },
]

const Photo = ({ size }: { size: "sm" | "lg" }) => (
  <div class={`photo photo-${size}`} aria-label="Photo placeholder">
    <span>MT</span>
  </div>
)

const Ctas = ({ hero }: { hero: HeroCopy }) => (
  <div class="ctas">
    {hero.primaryCta && (
      <a class="cta cta-primary" href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
    )}
    {hero.secondaryCta && (
      <a class="cta cta-secondary" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
    )}
    <a class="cta cta-ghost" href="/cv/">CV</a>
  </div>
)

const Status = ({ text }: { text: string }) =>
  text ? (
    <p class="status">
      <span class="status-dot" aria-hidden="true" />
      {text}
    </p>
  ) : null

const Contact = () => (
  <section class="contact">
    <p class="kicker">Contact</p>
    <p class="contact-copy">
      I'm looking for research positions in neuro-AI, neuromorphic computing and
      brain-inspired learning. <a href="mailto:M@Tarlton.info">Email me</a>, or find me on{" "}
      <a href="https://www.linkedin.com/in/m-tarlton/">LinkedIn</a> and{" "}
      <a href="https://github.com/MichaTarlton">GitHub</a>.
    </p>
  </section>
)

// ── Variant A: Studio ─────────────────────────────────────────
const VariantA = ({ hero }: { hero: HeroCopy }) => (
  <div class="landing variant-a" data-variant-name="Studio · field behind the type">
    <section class="a-hero">
      <div class="a-field" aria-hidden="true">
        <div class="grid-paper" />
        <canvas class="field-canvas" data-field="hero" />
      </div>
      <div class="a-hero-inner">
        <Photo size="lg" />
        <div>
          <p class="kicker accent">NeuroAI researcher · Oslo</p>
          <h1 class="display">{hero.name}</h1>
          <p class="lede">{hero.identity}</p>
          <Status text={hero.status ?? ""} />
          <Ctas hero={hero} />
        </div>
      </div>
    </section>

    {hero.thinking && (
      <section class="a-thinking">
        <span class="kicker accent">Currently thinking about</span>
        <p class="thinking-copy">{hero.thinking}</p>
      </section>
    )}

    <section class="a-research">
      <div class="section-head">
        <h2>Featured research</h2>
        <a class="more" href="/research/">All research →</a>
      </div>
      <div class="a-cards">
        {research.map((r) => (
          <a class="a-card" href={r.href}>
            <div class="a-card-fig">{r.fig}</div>
            <p class="q">{r.q}</p>
            <p class="meta">{r.meta}</p>
          </a>
        ))}
      </div>
    </section>

    <section class="a-recent">
      <div class="section-head">
        <h2>Recently in the Cortex</h2>
        <a class="more" href="/wiki/">Enter the Cortex →</a>
      </div>
      <ul class="recent-list">
        {recent.map((n) => (
          <li>
            <span class={`maturity m-${n.m}`} title={n.m} />
            <a href="/wiki/">{n.t}</a>
            <span class="date">{n.d}</span>
          </li>
        ))}
      </ul>
    </section>

    <Contact />
  </div>
)

// ── Variant B: Letter ─────────────────────────────────────────
const VariantB = ({ hero }: { hero: HeroCopy }) => (
  <div class="landing variant-b" data-variant-name="Letter · editorial column, no canvas">
    <section class="b-hero">
      <div class="b-byline">
        <Photo size="sm" />
        <div>
          <p class="kicker accent">NeuroAI researcher · Oslo</p>
          <h1 class="display">{hero.name}</h1>
        </div>
      </div>
      <p class="b-letter drop-cap">{hero.identity}</p>
      {hero.thinking && (
        <p class="b-thinking">
          <em>Currently thinking about</em> {hero.thinking}.
        </p>
      )}
      <Status text={hero.status ?? ""} />
      <Ctas hero={hero} />
    </section>

    <section class="b-research">
      <h2>Three questions I'm working on</h2>
      <ol class="b-rows">
        {research.map((r) => (
          <li>
            <a class="b-row" href={r.href}>
              <span class="b-num">{r.n}</span>
              <div class="b-row-body">
                <p class="q">{r.q}</p>
                <p class="blurb">{r.blurb}</p>
                <p class="meta">
                  {r.meta} <span class="pill">{r.status}</span>
                </p>
              </div>
              <div class="b-row-fig">{r.fig}</div>
            </a>
          </li>
        ))}
      </ol>
    </section>

    <section class="b-recent">
      <h2>Recently in the Cortex</h2>
      <p class="b-recent-copy">
        A working garden of notes behind a <a href="/wiki/">marked door</a>. Latest:{" "}
        {recent.map((n, i) => (
          <>
            <a href="/wiki/">{n.t}</a>
            {i < recent.length - 1 ? ", " : "."}
          </>
        ))}
      </p>
    </section>

    <Contact />
  </div>
)

// ── Variant C: Notebook ───────────────────────────────────────
const VariantC = ({ hero }: { hero: HeroCopy }) => (
  <div class="landing variant-c" data-variant-name="Notebook · sticky rail, page-wide field">
    <canvas class="field-canvas c-page-field" data-field="page" aria-hidden="true" />
    <div class="c-grid">
      <aside class="c-rail">
        <Photo size="lg" />
        <p class="kicker accent">NeuroAI researcher</p>
        <h1 class="display">{hero.name}</h1>
        <p class="c-oneliner">
          Spiking networks, neuro-dynamics, and time in the brain — groundwork for the next generation of machine intelligence.
        </p>
        <Status text={hero.status ?? ""} />
        <Ctas hero={hero} />
        <dl class="c-facts">
          <dt>Based</dt><dd>Oslo, Norway</dd>
          <dt>Affiliation</dt><dd>OsloMet</dd>
          <dt>Email</dt><dd><a href="mailto:M@Tarlton.info">M@Tarlton.info</a></dd>
        </dl>
      </aside>

      <main class="c-main">
        <section class="c-intro">
          <p class="lede">{hero.identity}</p>
          {hero.thinking && (
            <p class="c-thinking">
              <span class="kicker accent">Currently thinking about</span>
              <span class="thinking-copy">{hero.thinking}</span>
            </p>
          )}
        </section>

        <section class="c-research">
          <div class="section-head">
            <h2>Featured research</h2>
            <a class="more" href="/research/">All →</a>
          </div>
          {research.map((r) => (
            <a class="c-row" href={r.href}>
              <div class="c-row-fig">{r.fig}</div>
              <div>
                <p class="meta">{r.n} · {r.meta}</p>
                <p class="q">{r.q}</p>
                <p class="blurb">{r.blurb}</p>
              </div>
            </a>
          ))}
        </section>

        <section class="c-recent">
          <div class="section-head">
            <h2>Recently in the Cortex</h2>
            <a class="more" href="/wiki/">Enter →</a>
          </div>
          <ul class="recent-list">
            {recent.map((n) => (
              <li>
                <span class={`maturity m-${n.m}`} title={n.m} />
                <a href="/wiki/">{n.t}</a>
                <span class="date">{n.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <Contact />
      </main>
    </div>
  </div>
)

const Hero: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null
  const hero = (fileData.frontmatter?.hero ?? {}) as HeroCopy
  hero.name ??= "Mike Tarlton"
  hero.identity ??= "Neuro-AI researcher building brain-inspired learning systems."

  return (
    <div class="landing-proto">
      <VariantA hero={hero} />
      <VariantB hero={hero} />
      <VariantC hero={hero} />
      <div class="proto-bar" role="toolbar" aria-label="Prototype variant switcher">
        <button class="proto-prev" aria-label="Previous variant">←</button>
        <span class="proto-label">…</span>
        <button class="proto-next" aria-label="Next variant">→</button>
        <a class="proto-theme" href="#" title="Toggle light/dark">◐</a>
      </div>
    </div>
  )
}

Hero.beforeDOMLoaded = `(function(){
  // PROTOTYPE: light is the design; force light on the landing unless ?dark.
  var p=new URLSearchParams(location.search);
  if(location.pathname==="/"||location.pathname==="/index.html"){
    if(!p.has("dark")){localStorage.setItem("theme","light");document.documentElement.setAttribute("saved-theme","light");}
  }
  var v=(p.get("variant")||"a").toLowerCase(); if(!/^[abc]$/.test(v)) v="a";
  document.documentElement.setAttribute("data-variant",v);
})();`

Hero.afterDOMLoaded = landingScript

export default (() => Hero) satisfies QuartzComponentConstructor
