import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"
import { projects } from "./projects"
import { ResearchHub } from "./hub"
import { ResearchProject } from "./project"

/**
 * Natural track research — hub vs project branch by fileData.slug (Task 1
 * scaffold; full hub album / project covers / figures in Task 5).
 *
 * Cross-lane fix (GR lane finding): `fileData.slug` for `content/research/<slug>/
 * index.md` is `research/<slug>/index`, NOT `research/<slug>` — the T1 scaffold's
 * project branch never matched, so project pages rendered no component. Strip
 * the trailing `/index` before matching. The hub's own slug is `research/index`,
 * which keeps matching unchanged.
 */
const normalizeSlug = (slug: string) => slug.replace(/\/index$/, "")

const isResearchSlug = (slug: string) => slug === "research/index" || slug.startsWith("research/")

const Research: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const raw = fileData.slug ?? ""
  if (!isResearchSlug(raw)) return null
  const slug = normalizeSlug(raw)

  if (slug === "research") {
    return <ResearchHub description={fileData.frontmatter?.description} />
  }

  const project = projects.find((p) => slug === `research/${p.slug}`)
  if (!project) return null
  return <ResearchProject project={project} />
}

// prescript static: seed html[data-page="research"] on research pages. Statics
// are collected globally, so gate on location.pathname (hub + project pages).
// Seed-only (GR-lane finding 1): never clobber an existing value — the topbar
// prescript derives data-page from the pathname on every SPA navigation.
Research.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if ((p === "/research" || p.startsWith("/research/")) && !document.documentElement.hasAttribute("data-page")) {
    document.documentElement.setAttribute("data-page", "research");
  }
`

export default (() => Research) satisfies QuartzComponentConstructor
