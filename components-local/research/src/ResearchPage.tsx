import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import { isResearchSlug } from "./slug"
import { projects } from "./projects"

/**
 * Graphic Realism research hub + project pages — beforeBody, is-research.
 * Task 1 scaffold: branches hub vs project by fileData.slug. The hub index
 * table, project document sheets and flat figures land in Task 5.
 */
const ResearchPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (!isResearchSlug(slug)) return null

  if (slug === "research/index") {
    return (
      <section class="gr-research gr-research-hub">
        <h1>Research</h1>
        {projects.map((p) => (
          <a class="gr-research-row" href={`/research/${p.slug}/`}>
            {p.q}
          </a>
        ))}
      </section>
    )
  }

  const projectSlug = slug.replace(/^research\//, "")
  const project = projects.find((p) => p.slug === projectSlug)
  return (
    <section class="gr-research gr-research-project">
      <h1>{project?.name ?? projectSlug}</h1>
    </section>
  )
}

/** Sets the page scope attribute for research hub/project; topbar fills the fallback. */
ResearchPage.beforeDOMLoaded = `(function () {
  document.documentElement.setAttribute("data-page", "research");
})();`

export default (() => ResearchPage) satisfies QuartzComponentConstructor
