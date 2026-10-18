import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

/**
 * Graphic Realism landing — beforeBody, index only.
 * Task 1 scaffold: minimal stub marking the landing band structure. The full
 * band composition (masthead, hero sim mount, research index, Cortex door,
 * contact) lands in Task 3.
 */
const Landing: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const hero = (fileData.frontmatter?.hero ?? {}) as { name?: string }
  return (
    <div class="gr-landing">
      <h1>{hero.name}</h1>
    </div>
  )
}

export default (() => Landing) satisfies QuartzComponentConstructor
