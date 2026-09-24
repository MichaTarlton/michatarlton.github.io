import { registerCondition } from "../../../quartz/plugins/loader/conditions"

/**
 * Quartz layout conditions used by the research prototype (ticket 08).
 * Registered at module load so quartz.config.yaml `condition:` entries resolve.
 */
export function isResearchSlug(slug: string): boolean {
  return slug === "research/index" || slug.startsWith("research/")
}

registerCondition("is-research", (props) => isResearchSlug(props.fileData.slug ?? ""))
registerCondition("not-research", (props) => !isResearchSlug(props.fileData.slug ?? ""))
// Chrome components (title, meta, tags, breadcrumbs, note-properties) must stay
// off the landing AND off research pages; the index renders its own header.
registerCondition("not-index-not-research", (props) => {
  const slug = props.fileData.slug ?? ""
  return slug !== "index" && !isResearchSlug(slug)
})

export { default as ResearchPage } from "./ResearchPage"
