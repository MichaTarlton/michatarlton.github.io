import type { Project } from "./projects"
import { projects } from "./projects"
import { ProjectFigure } from "./figures"

/**
 * Graphic Realism project sheet (brief §4.3): document-sheet header band with
 * oversized numeral + FIG tag, name in Archivo display caps, boxed mono status
 * badge, venue line, question in the author's voice; Outputs row of
 * 2px-border rectangular mono buttons (external links carry ↗); flat figure
 * plate. The prose article below is Quartz's — this component renders nothing
 * for it (it lives in beforeBody, above the article).
 */

/** ↗ glyph for links that leave the site (http/mailto), per the mono Outputs row. */
function isExternal(href: string): boolean {
  return /^(https?:|mailto:)/i.test(href)
}

export function ResearchProject({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug)
  const numeral = index >= 0 ? String(index + 1).padStart(2, "0") : "00"

  return (
    <section class="gr-sheet" aria-label={project.name}>
      <div class="gr-sheet__head">
        <div class="gr-sheet__gutter">
          <span class="gr-sheet__fig annotation">FIG. {numeral}</span>
          <span class="gr-sheet__numeral display" aria-hidden="true">
            {numeral}
          </span>
        </div>
        <div class="gr-sheet__titleblock">
          <h1 class="gr-sheet__name display">{project.name}</h1>
          <div class="gr-sheet__meta">
            <span class="gr-sheet__badge">{project.status}</span>
            <span class="gr-sheet__venue annotation">{project.venue}</span>
          </div>
          <p class="gr-sheet__q voice">{project.q}</p>
        </div>
      </div>

      {project.outputs.length > 0 && (
        <div class="gr-sheet__outputs">
          <span class="gr-sheet__outputs-label annotation">OUTPUTS</span>
          <div class="gr-sheet__outputs-row">
            {project.outputs.map((o) => (
              <a
                class="gr-sheet__out"
                href={o.href}
                key={o.href}
                {...(isExternal(o.href) ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                {o.label}
                {isExternal(o.href) && (
                  <span class="gr-sheet__ext" aria-hidden="true">
                    {" ↗"}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <figure class="gr-sheet__plate">
        <ProjectFigure slug={project.slug} />
      </figure>
    </section>
  )
}
