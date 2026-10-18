import { projects, also } from "./projects"
import { SketchStroke } from "../../landing/src/marks"

/**
 * Research hub — plate album (Task 5). One mounted plate per project: gilded
 * corners, question in the voice register, name + status badge, venue line,
 * blurb; `also` items below. Gold is leaf (corners, rules) and the hand mark is
 * the sketch stroke under the title (brief §5.2.2). No Cortex content on hub
 * pages (brief §3).
 */
export const ResearchHub = ({ description }: { description?: string }) => (
  <div class="nat-research nat-research-hub">
    <header class="nat-album__head">
      <h1>Research</h1>
      <SketchStroke variant="name" />
      {description ? <p class="nat-album__lede voice">{description}</p> : null}
    </header>

    <div class="nat-album">
      {projects.map((p) => (
        <figure class="nat-plate nat-album__plate" key={p.slug}>
          <span class="nat-plate__corner nat-plate__corner--tl" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--tr" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--bl" aria-hidden="true" />
          <span class="nat-plate__corner nat-plate__corner--br" aria-hidden="true" />
          <figcaption class="nat-album__caption">
            <h2 class="nat-album__q voice">{p.q}</h2>
            <p class="nat-album__namerow">
              <a class="nat-album__name" href={`/research/${p.slug}/`}>
                {p.name}
              </a>
              <span class="nat-badge nat-mono">{p.status}</span>
            </p>
            <p class="nat-album__venue">{p.venue}</p>
            <p class="nat-album__blurb">{p.blurb}</p>
          </figcaption>
        </figure>
      ))}
    </div>

    <section class="nat-album__also">
      <h2 class="nat-album__also-title nat-mono">Also</h2>
      <ul class="nat-also">
        {also.map((a) => {
          const external = /^https?:\/\//.test(a.href)
          return (
            <li key={a.href}>
              <a href={a.href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
                {a.label}
              </a>
              {external ? " ↗" : ""} <span class="nat-mono">{a.meta}</span>
            </li>
          )
        })}
      </ul>
    </section>
  </div>
)
