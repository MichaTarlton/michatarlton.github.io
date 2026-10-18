import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
// Data-only import from the research module (projects.ts is pure data, carried
// in Task 1). esbuild bundles it into this component's dist; no component code
// is shared between the two tracks' modules.
import { projects, also } from "../../research/src/projects"

/** `hero` frontmatter block as authored in content/index.md (read as-is). */
interface HeroFrontmatter {
  name?: string
  identity?: string
  status?: string
  primaryCta?: { label?: string; href?: string }
  photo?: string
  photoAlt?: string
}

const CV_HREF = "/attachments/tarlton-cv.pdf"

const contacts: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" },
]

/**
 * Graphic Realism landing — beforeBody, index only. Task 3: the five-band
 * engineered-dossier composition (masthead / sim mount / research index /
 * Cortex door / contact). Pure SSR markup: the band-B mount carries stable
 * id + data-attributes for the Task 4 renderer; no sim logic here.
 *
 * Design rules honored (brief §4.2): bands separated by 2px rules, rail-offset,
 * hairline grid; ONE hot accent per view (the door marker block); annotation
 * carries data or disappears; radius 0, no shadows, no gradients; hover/focus
 * states are 0ms hard flips.
 */
const Landing: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const hero = (fileData.frontmatter?.hero ?? {}) as HeroFrontmatter

  return (
    <div class="gr-landing">
      {/* ── Band A: masthead ─────────────────────────────────────────── */}
      <section class="gr-band gr-band--masthead" aria-label="About">
        <div class="gr-masthead">
          <div class="gr-masthead__text">
            <h1 class="gr-masthead__name display">{hero.name}</h1>
            <p class="gr-masthead__identity voice">{hero.identity}</p>
            {hero.status && <p class="gr-masthead__status annotation">{hero.status}</p>}
            <div class="gr-masthead__ctas">
              {hero.primaryCta?.href && (
                <a
                  class="gr-btn"
                  href={hero.primaryCta.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {hero.primaryCta.label ?? "Faculty page"}
                </a>
              )}
              <a class="gr-btn" href={CV_HREF} download>
                Download CV
              </a>
            </div>
          </div>
          {hero.photo && (
            <figure class="gr-masthead__plate">
              <img src={hero.photo} alt={hero.photoAlt ?? ""} width="220" height="220" />
            </figure>
          )}
        </div>
      </section>

      {/* ── Band B: hero simulation mount (markup only; sim logic Task 4) ── */}
      <section class="gr-band gr-band--sim" aria-label="Hero figure">
        <div
          class="gr-sim"
          id="gr-sim-mount"
          data-sim="sbf-oscillator-bank"
          data-sim-oscillators="6"
          data-sim-fps="30"
        >
          <canvas class="gr-sim__canvas" width="1200" height="480" aria-hidden="true" />
          {/* Static corner annotations; wired (counts/cadence live) by Task 4. */}
          <span class="gr-sim__annot gr-sim__annot--tl">FIG. 01</span>
          <span class="gr-sim__annot gr-sim__annot--tr">OSC 6</span>
          <span class="gr-sim__annot gr-sim__annot--br">30 FPS</span>
        </div>
      </section>

      {/* ── Band C: research index ───────────────────────────────────── */}
      <section class="gr-band gr-band--research" aria-label="Research index">
        <h2 class="gr-band__head h2">Research</h2>
        {projects.map((p, i) => (
          <a class="gr-rrow" href={`/research/${p.slug}/`}>
            <span class="gr-rrow__numeral display">{String(i + 1).padStart(2, "0")}</span>
            <span class="gr-rrow__body">
              <span class="gr-rrow__q voice">{p.q}</span>
              <span class="gr-rrow__meta annotation">
                {p.name} · {p.status}
              </span>
              <span class="gr-rrow__venue annotation">{p.venue}</span>
            </span>
          </a>
        ))}
        <ul class="gr-also">
          {also.map((a) => (
            <li class="annotation">
              <a href={a.href}>{a.label}</a> · {a.meta}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Band D: Cortex door (door only, no Cortex content) ─────────── */}
      <section class="gr-band gr-band--door" aria-label="Cortex">
        <a class="gr-door" href="/wiki/">
          <span class="gr-door__marker" aria-hidden="true" />
          <span class="gr-door__label display">Cortex</span>
          <span class="gr-door__coord">→ /wiki/</span>
          <svg
            class="gr-door__chevron"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 4 L16 12 L8 20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
            />
          </svg>
        </a>
      </section>

      {/* ── Band E: contact ──────────────────────────────────────────── */}
      <section class="gr-band gr-band--contact" aria-label="Contact">
        <h2 class="gr-band__head h2">Contact</h2>
        <p class="gr-contact__email">
          <a href={contacts[0].href}>
            {contacts[0].label === "Email" ? "M@Tarlton.info" : contacts[0].label}
          </a>
        </p>
        <p class="gr-contact__links">
          {contacts.slice(1).map((c, i) => (
            <>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <a href={c.href} target="_blank" rel="noreferrer noopener">
                {c.label}
              </a>
            </>
          ))}
        </p>
      </section>
    </div>
  )
}

/**
 * Seeds the page scope attribute for the landing. The topbar prescript runs
 * first and derives the same value from the pathname, so this must only fill
 * an unset attribute — an unconditional set here would clobber the value on
 * every other page and light up the landing/rail chrome site-wide.
 */
Landing.beforeDOMLoaded = `(function () {
  if (!document.documentElement.hasAttribute("data-page")) {
    document.documentElement.setAttribute("data-page", "index");
  }
})();`

/**
 * Task 4 wiring: the compiled sim bundle (scripts/build-components.sh →
 * quartz/static/js/gr-sim.js, served from /static/ by the Static emitter).
 * Injected as a persisted module script so the SPA head-patch re-adds it on
 * nav; the bundle itself guards on the mount, self-boots, and tears down its
 * previous instance on re-init, so this is idempotent across navigations.
 */
Landing.afterDOMLoaded = `(function () {
  function inject() {
    if (document.querySelector("script[data-gr-sim]")) return;
    var s = document.createElement("script");
    s.type = "module";
    s.src = "/static/js/gr-sim.js";
    s.setAttribute("data-gr-sim", "");
    s.setAttribute("data-persist", "");
    document.head.appendChild(s);
  }
  if (document.getElementById("gr-sim-mount")) inject();
  // The loader runs once per full page load (module cache); re-check on SPA
  // nav so index reached from another page still boots the bundle.
  document.addEventListener("nav", function () {
    if (document.getElementById("gr-sim-mount")) inject();
  });
})();`

export default (() => Landing) satisfies QuartzComponentConstructor
