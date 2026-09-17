import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import heroVectorField from "./heroVectorField"

interface HeroCopy {
  name?: string
  identity?: string
  status?: string
  thinking?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

/**
 * Landing hero — Blueprint §3–§4.
 * Reads copy from the index page's `hero:` frontmatter so it stays editable
 * in markdown-land. Renders only on the index page.
 * The ambient vector-field canvas is drawn on the hero graph-grid;
 * the grid remains as the reduced-motion fallback.
 */
const Hero: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null

  const hero = (fileData.frontmatter?.hero ?? {}) as HeroCopy
  const name = hero.name ?? "Mike Tarlton"
  const identity =
    hero.identity ?? "Neuro-AI researcher building brain-inspired learning systems."
  const status = hero.status ?? ""
  const thinking = hero.thinking ?? ""

  return (
    <section class="hero">
      <div class="hero-graph" aria-hidden="true">
        <div class="hero-graph-grid" />
        <canvas id="hero-canvas" class="hero-canvas" />
      </div>
      <div class="hero-text">
        <p class="micro-label hero-eyebrow">NeuroAI Researcher</p>
        <h1 class="hero-name">{name}</h1>
        <p class="hero-identity">{identity}</p>
        {thinking && (
          <p class="hero-thinking">
            <span class="thinking-accent" aria-hidden="true" />
            <span class="thinking-label">Currently thinking about</span>
            <span class="thinking-copy">{thinking}</span>
          </p>
        )}
        {status && (
          <p class="hero-status">
            <span class="status-dot" aria-hidden="true" />
            {status}
          </p>
        )}
        <div class="hero-ctas">
          {hero.primaryCta && (
            <a class="cta cta-primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
          )}
          {hero.secondaryCta && (
            <a class="cta cta-secondary" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

Hero.afterDOMLoaded = heroVectorField

export default (() => Hero) satisfies QuartzComponentConstructor
