import { projects, also } from "./projects"

/**
 * Graphic Realism research hub — index-table treatment (brief §4.2.7: the
 * grid is visible; §4.2.3: annotation carries data). Left gutter column with
 * the FIG. numeral per row; question in the author's voice; boxed mono status
 * badge; venue + one-line blurb; hard 0ms hover flip. `also` items below as
 * annotation lines. No Cortex content (Hub page, §3). Deterministic SSR.
 */
export function ResearchHub() {
  return (
    <section class="gr-hub" aria-label="Research index">
      <div class="gr-hub__head">
        <h1 class="gr-hub__title display">Research</h1>
        <p class="gr-hub__count annotation">{String(projects.length).padStart(2, "0")} PROJECTS</p>
      </div>

      <div class="gr-hub__table">
        {projects.map((p, i) => (
          <a class="gr-hub__row" href={`/research/${p.slug}/`} key={p.slug}>
            <span class="gr-hub__gutter" aria-hidden="true">
              <span class="gr-hub__fig">FIG. {String(i + 1).padStart(2, "0")}</span>
              <span class="gr-hub__numeral display">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <span class="gr-hub__body">
              <span class="gr-hub__q voice">{p.q}</span>
              <span class="gr-hub__meta">
                <span class="gr-hub__name">{p.name}</span>
                <span class="gr-hub__badge">{p.status}</span>
              </span>
              <span class="gr-hub__venue annotation">{p.venue}</span>
              <span class="gr-hub__blurb">{p.blurb}</span>
            </span>
          </a>
        ))}
      </div>

      <div class="gr-hub__also">
        <p class="gr-hub__also-label annotation">ALSO</p>
        <ul>
          {also.map((a) => (
            <li class="gr-hub__also-item annotation" key={a.href}>
              <a href={a.href}>{a.label}</a> · {a.meta}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
