import { registerCondition } from "../../../quartz/plugins/loader/conditions"
import { isResearchSlug } from "./slug"

/**
 * Quartz layout conditions used by the research component (Graphic Realism track).
 * Registered at module load so quartz.config.yaml `condition:` entries resolve.
 * registerCondition is idempotent (Map.set on the process-global registry), so
 * re-loading this module on rebuilds is safe.
 */
registerCondition("is-research", (props) => isResearchSlug(props.fileData.slug ?? ""))
registerCondition("not-research", (props) => !isResearchSlug(props.fileData.slug ?? ""))
// Chrome components (title, meta, tags, breadcrumbs, note-properties) must stay
// off the landing AND off research pages; the index renders its own header.
registerCondition("not-index-not-research", (props) => {
  const slug = props.fileData.slug ?? ""
  return slug !== "index" && !isResearchSlug(slug)
})

export { default as ResearchPage } from "./ResearchPage"
