import type { Project } from "./projects"
import { SketchStroke } from "../../landing/src/marks"
import { figureForSlug } from "./figures"

/**
 * Research project page (Task 5): plate cover header on a gold-wash slab (name,
 * status badge, venue line, question in the voice register), a mono Outputs row
 * with gilded-underline links, then the ink-and-gold figure plate. Quartz
 * renders the authored prose article below with the margin column — this
 * component does not render content itself. Gold is leaf: slab wash, gilded
 * corners, underline accents; never a text colour (pinned test).
 */
export const ResearchProject = ({ project: p }: { project: Project }) => (
  <div class="nat-research nat-research-project">
    <header class="nat-cover">
      <div class="nat-cover__slab">
        <span class="nat-plate__corner nat-plate__corner--tl" aria-hidden="true" />
        <span class="nat-plate__corner nat-plate__corner--br" aria-hidden="true" />
        <h1 class="nat-cover__name">{p.name}</h1>
        <p class="nat-cover__badgerow">
          <span class="nat-badge nat-mono">{p.status}</span>
          <span class="nat-cover__venue">{p.venue}</span>
        </p>
        <p class="nat-cover__q voice">{p.q}</p>
        <SketchStroke variant="name" />
      </div>
    </header>

    <section class="nat-outputs" aria-label="Outputs">
      <h2 class="nat-outputs__label nat-mono">Outputs</h2>
      <ul class="nat-outputs__row">
        {p.outputs.map((o) => {
          const external = /^https?:\/\//.test(o.href)
          return (
            <li key={o.href}>
              <a
                class="nat-outputs__link"
                href={o.href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
              >
                {o.label}
              </a>
              {external ? (
                <span class="nat-outputs__ext" aria-hidden="true">
                  {" ↗"}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>

    {figureForSlug(p.slug)}
  </div>
)
