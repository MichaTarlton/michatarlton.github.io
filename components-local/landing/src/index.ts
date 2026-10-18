import { registerCondition } from "../../../quartz/plugins/loader/conditions"

/**
 * Quartz layout condition for the landing component (Graphic Realism track).
 * Registered at module load so quartz.config.yaml `condition:` entries resolve.
 * registerCondition is idempotent (Map.set on the process-global registry), so
 * re-loading this module on rebuilds is safe.
 */
registerCondition("is-index", (props) => props.fileData.slug === "index")

export { default as Landing } from "./Landing"
