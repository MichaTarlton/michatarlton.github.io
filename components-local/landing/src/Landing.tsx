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

// prescript static: mark landing pages with html[data-page="index"]. Statics are
// collected globally (one prescript for every page), so gate on location.pathname.
Landing.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if (p === "/" || p === "/index.html") {
    document.documentElement.dataset.page = "index";
  }
`

export default (() => Landing) satisfies QuartzComponentConstructor
