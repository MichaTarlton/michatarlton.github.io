import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

interface HeroCopy {
  eyebrow?: string
  name?: string
  identity?: string
  status?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

/**
 * Landing hero — Blueprint §3–§4: name, one-sentence identity, status line,
 * and both CTAs. The autonomous spiking-network canvas has been removed.
 * Copy is read from the index page's `hero:` frontmatter so it stays editable
 * in markdown-land. Renders only on the index page.
 */
const Hero: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null

  const hero = (fileData.frontmatter?.hero ?? {}) as HeroCopy
  const name = hero.name ?? "Mike Tarlton"
  const identity =
    hero.identity ?? "Neuro-AI researcher building brain-inspired learning systems."
  const status = hero.status ?? ""
  const eyebrow = hero.eyebrow ?? ""

  return (
    <section class="hero">
      <div class="hero-text">
        {eyebrow && <p class="micro-label hero-eyebrow">{eyebrow}</p>}
        <h1 class="hero-name">{name}</h1>
        <p class="hero-identity">{identity}</p>
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

export default (() => Hero) satisfies QuartzComponentConstructor
