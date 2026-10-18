import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import { projects } from "./projects"

/**
 * Natural track research — hub vs project branch by fileData.slug (Task 1 scaffold).
 * Full hub album / project covers / figures land in Task 5.
 */
const isResearchSlug = (slug: string) => slug === "research/index" || slug.startsWith("research/")

const Research: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (!isResearchSlug(slug)) return null

  if (slug === "research/index") {
    return (
      <div class="nat-research nat-research-hub">
        <h1>Research</h1>
        {projects.map((p) => (
          <p class="nat-research-hub-question" key={p.slug}>
            {p.q}
          </p>
        ))}
      </div>
    )
  }

  const p = projects.find((proj) => slug.startsWith(`research/${proj.slug}`))
  return (
    <div class="nat-research nat-research-project">
      <h1>{p?.name ?? "Research"}</h1>
    </div>
  )
}

// prescript static: mark research pages with html[data-page="research"]. Statics
// are collected globally, so gate on location.pathname (hub + project pages).
Research.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if (p === "/research" || p.startsWith("/research/")) {
    document.documentElement.dataset.page = "research";
  }
`

export default (() => Research) satisfies QuartzComponentConstructor
