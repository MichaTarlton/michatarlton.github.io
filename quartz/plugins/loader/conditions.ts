import { QuartzComponentProps } from "../../components/types"

export type ConditionPredicate = (props: QuartzComponentProps) => boolean

const builtinConditions: Record<string, ConditionPredicate> = {
  "not-index": (props) => props.fileData.slug !== "index",
  "has-tags": (props) => {
    const tags = props.fileData.frontmatter?.tags
    return Array.isArray(tags) && tags.length > 0
  },
  "has-backlinks": (props) => {
    const backlinks = (props.fileData as Record<string, unknown>).backlinks
    return Array.isArray(backlinks) && backlinks.length > 0
  },
  "has-toc": (props) => {
    const toc = (props.fileData as Record<string, unknown>).toc
    return Array.isArray(toc) && toc.length > 0
  },
}

// Custom conditions are kept on a process-global registry so that locally
// bundled component plugins (components-local/*/dist, inlined by esbuild) can
// register conditions that the core loader (bundled separately by `quartz
// build`) resolves — the two bundles otherwise share no module instance.
const globals = globalThis as { __quartzCustomConditions?: Map<string, ConditionPredicate> }

function sharedRegistry(): Map<string, ConditionPredicate> {
  return (globals.__quartzCustomConditions ??= new Map())
}

export function registerCondition(name: string, predicate: ConditionPredicate): void {
  sharedRegistry().set(name, predicate)
}

export function getCondition(name: string): ConditionPredicate | undefined {
  return sharedRegistry().get(name) ?? builtinConditions[name]
}

export function getAllConditionNames(): string[] {
  return [...Object.keys(builtinConditions), ...sharedRegistry().keys()]
}
