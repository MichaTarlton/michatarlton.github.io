import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

/**
 * Natural track landing — minimal scaffold (Task 1). Composition lands in Task 3.
 * The hero frontmatter in content/index.md is read as-is (content stays Mike's).
 */
interface HeroCopy {
  name?: string
  identity?: string
  status?: string
}

const Landing: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const hero = (fileData.frontmatter?.hero ?? {}) as HeroCopy
  return (
    <div class="nat-landing">
      <h1 class="nat-landing-name">{hero.name ?? "Mike Tarlton"}</h1>
    </div>
  )
}

export default (() => Landing) satisfies QuartzComponentConstructor
