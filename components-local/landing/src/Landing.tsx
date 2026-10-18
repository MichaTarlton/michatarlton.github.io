import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import { projects, also } from "../../research/src/projects"
import { MosaicBand, SketchStroke, SketchFrame, SprigMark, DoorTree } from "./marks"
import simMount from "../dist/simMount.generated"

/**
 * Natural track landing (Task 3): notebook-sheet bands divided by thin gilded
 * mosaic bands. Gold is leaf (brief §5.2): rules, initial caps, mosaic bands,
 * door frame; never large fills, never a text colour. One hand mark per band
 * minimum; hand marks are placeholder-grade per brief §9.5. No sim logic here
 * (Task 4): band B ships the framed plate and a stable mount only.
 *
 * Content is Mike's: hero frontmatter from content/index.md is read as-is.
 */
interface HeroCopy {
  name?: string
  identity?: string
  status?: string
  primaryCta?: { label?: string; href?: string }
  photo?: string
  photoAlt?: string
}

const Landing: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const hero = (fileData.frontmatter?.hero ?? {}) as HeroCopy
  return (
    <div class="nat-landing">
      {/* (A) opening band: name, voice lede, photo plate, CTAs, status */}
      <section class="nat-band nat-band--opening">
        <div class="nat-band__grid">
          <div class="nat-band__text">
            <h1 class="nat-landing-name initial-cap">{hero.name ?? "Mike Tarlton"}</h1>
            <SketchStroke variant="name" />
            <p class="nat-landing-identity voice">{hero.identity}</p>
            <div class="nat-landing-ctas">
              {hero.primaryCta?.href ? (
                <a class="nat-cta" href={hero.primaryCta.href} target="_blank" rel="noopener">
                  {hero.primaryCta.label ?? "Faculty page"}
                </a>
              ) : null}
              <a class="nat-cta" href="/attachments/tarlton-cv.pdf" download>
                Download CV
              </a>
            </div>
            {hero.status ? <p class="nat-landing-status nat-mono">{hero.status}</p> : null}
          </div>
          {hero.photo ? (
            <div class="nat-plate-photo">
              <img src={hero.photo} alt={hero.photoAlt ?? ""} loading="eager" />
            </div>
          ) : null}
        </div>
      </section>

      <MosaicBand />

      {/* (B) sim plate: framed plate with gilded corners + sketch border,
          stable canvas mount for Task 4 (no sim logic here). */}
      <section class="nat-band nat-band--sim">
        <figure class="nat-plate nat-sim-plate">
          <SketchFrame />
          <span class="nat-plate__corner nat-plate__corner--tl" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--tr" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--bl" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--br" aria-hidden="true" />
          <canvas
            id="nat-sim-canvas"
            class="nat-sim-canvas"
            data-sim="tree"
            data-sim-seed="tarlton-nat"
            data-sim-tick="33"
            role="img"
            aria-label="A growing branching graph, notebook ink"
          />
          <figcaption class="nat-plate__fig nat-mono">FIG. 01 · growing graph</figcaption>
        </figure>
      </section>

      <MosaicBand />

      {/* (C) featured research: notebook spreads per project + also items */}
      <section class="nat-band nat-band--research">
        {projects.map((p) => (
          <div class="nat-spread" key={p.slug}>
            <div class="nat-col">
              <div class="nat-col__main">
                <h2 class="nat-spread__q voice">{p.q}</h2>
                <p class="nat-spread__blurb">{p.blurb}</p>
                <p class="nat-spread__foot">
                  <a class="nat-spread__link" href={`/research/${p.slug}/`}>
                    {p.name}
                  </a>
                  <span class="nat-spread__status nat-mono">{p.status}</span>
                </p>
              </div>
              <aside class="nat-col__aside nat-spread__margin">
                <span class="nat-mono nat-spread__margin-label">[placeholder marginalia]</span>
                <p>Margin note goes here. The real marginalia is the author's own.</p>
              </aside>
            </div>
            <figure class="nat-plate nat-plate--figure" aria-hidden="true">
              <span class="nat-plate__corner nat-plate__corner--tl" />
              <span class="nat-plate__corner nat-plate__corner--br" />
              <SprigMark />
            </figure>
          </div>
        ))}
        <ul class="nat-also">
          {also.map((a) => (
            <li key={a.href}>
              <a
                href={a.href}
                target={a.href.startsWith("/") ? undefined : "_blank"}
                rel="noopener"
              >
                {a.label}
              </a>{" "}
              <span class="nat-mono">{a.meta}</span>
            </li>
          ))}
        </ul>
      </section>

      <MosaicBand />

      {/* (D) Cortex door: the one loud ornament. Door only, no Cortex content. */}
      <section class="nat-band nat-band--door">
        <a class="nat-door" href="/wiki/">
          <div class="nat-door__panel">
            <DoorTree />
            <h2 class="nat-door__name">The Cortex</h2>
            <p class="nat-door__note voice">
              Working notes, drafts, and the half-thoughts between.
            </p>
            <span class="nat-door__go nat-mono">enter</span>
          </div>
        </a>
      </section>

      <MosaicBand />

      {/* (E) contact */}
      <section class="nat-band nat-band--contact">
        <p class="nat-contact__note voice">
          I answer quickly. Write me at <a href="mailto:M@Tarlton.info">M@Tarlton.info</a>, or find
          me on{" "}
          <a href="https://www.linkedin.com/in/m-tarlton/" target="_blank" rel="noopener">
            LinkedIn
          </a>{" "}
          and{" "}
          <a href="https://github.com/MichaTarlton" target="_blank" rel="noopener">
            GitHub
          </a>
          .
        </p>
        <SketchStroke />
      </section>
    </div>
  )
}

// prescript static: seed html[data-page="index"] on landing pages. Statics are
// collected globally (one prescript for every page), so gate on location.pathname.
// Seed-only (GR-lane finding 1): never clobber an existing value — the topbar
// prescript derives data-page from the pathname on every SPA navigation, and an
// unconditional set here could stomp a fresher value on client-side nav.
Landing.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if ((p === "/" || p === "/index.html") && !document.documentElement.hasAttribute("data-page")) {
    document.documentElement.setAttribute("data-page", "index");
  }
`

// postscript static: the hero simulation mount (Task 4). Self-initializing IIFE
// compiled from src/simMount.ts by scripts/build-components.sh (dist is tracked,
// so this inlines as a plain string — no runtime bundle import). Guarded on the
// single mount id; tears down any previous instance for SPA idempotency.
Landing.afterDOMLoaded = simMount

export default (() => Landing) satisfies QuartzComponentConstructor
