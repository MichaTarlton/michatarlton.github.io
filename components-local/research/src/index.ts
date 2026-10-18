import { registerCondition } from "../../../quartz/plugins/loader/conditions"

/**
 * Quartz layout conditions used by the research track, registered at module load
 * so quartz.config.yaml `condition:` entries resolve. registerCondition overwrites
 * on a process-global registry, so repeated module loads are idempotent.
 */
export function isResearchSlug(slug: string): boolean {
  return slug === "research/index" || slug.startsWith("research/")
}

registerCondition("is-research", (props) => isResearchSlug(props.fileData.slug ?? ""))
registerCondition("not-research", (props) => !isResearchSlug(props.fileData.slug ?? ""))
// Chrome components (title, meta, tags, breadcrumbs, note-properties) stay off
// the landing and off research pages; those pages render their own headers.
registerCondition("not-index-not-research", (props) => {
  const slug = props.fileData.slug ?? ""
  return slug !== "index" && !isResearchSlug(slug)
})

export { default as Research } from "./Research"
