import { registerCondition } from "../../../quartz/plugins/loader/conditions"

/**
 * Quartz layout condition for the landing page, registered at module load so
 * quartz.config.yaml `condition:` entries resolve. registerCondition overwrites
 * on a process-global registry, so repeated module loads are idempotent.
 */
registerCondition("is-index", (props) => props.fileData.slug === "index")

export { default as Landing } from "./Landing"
