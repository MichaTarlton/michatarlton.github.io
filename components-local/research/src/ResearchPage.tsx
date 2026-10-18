import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import { isResearchSlug } from "./slug"
import { projects } from "./projects"
import { ResearchHub } from "./hub"
import { ResearchProject } from "./project"

/**
 * Graphic Realism research hub + project pages — beforeBody, is-research.
 * Task 5: the hub index-table treatment and the project document sheets with
 * flat annotated figures. Renders into the beforeBody slot (inside
 * .page-header per this fork's frame — see _base.scss caveat), so the Quartz
 * prose article renders below it untouched.
 *
 * Scoping: `html[data-page="research"]` plus a slug-derived modifier class on
 * the root section (hub vs per-project), so _research.scss can style the index
 * table and the project sheets independently.
 */
const ResearchPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (!isResearchSlug(slug)) return null

  if (slug === "research/index") {
    return (
      <section class="gr-research gr-research--hub">
        <ResearchHub />
      </section>
    )
  }

  // fileData.slug for content/research/<slug>/index.md is
  // "research/<slug>/index"; reduce to the bare project slug.
  const projectSlug = slug.replace(/^research\//, "").replace(/\/index$/, "")
  const project = projects.find((p) => p.slug === projectSlug)
  if (!project) return null

  return (
    <section class={`gr-research gr-research--project gr-research--${project.slug}`}>
      <ResearchProject project={project} />
    </section>
  )
}

/** Sets the page scope attribute for research hub/project; topbar fills the fallback. */
ResearchPage.beforeDOMLoaded = `(function () {
  document.documentElement.setAttribute("data-page", "research");
})();`

export default (() => ResearchPage) satisfies QuartzComponentConstructor
