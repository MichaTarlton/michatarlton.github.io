import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

/**
 * Natural track top bar — sentence-case nav with active state.
 * Nav set fixed by the brief: Index / Research / CV / Writing / Wiki.
 */
const links: { label: string; href: string; section: string }[] = [
  { label: "Index", href: "/", section: "index" },
  { label: "Research", href: "/research/", section: "research" },
  { label: "CV", href: "/cv/", section: "cv" },
  { label: "Writing", href: "/writing/", section: "writing" },
  { label: "Wiki", href: "/wiki/", section: "wiki" },
]

const Topbar: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  return (
    <nav class="nat-topbar" aria-label="Site">
      {links.map(({ label, href, section }) => {
        const active = section === "index" ? slug === "index" : slug.startsWith(`${section}/`)
        return (
          <a
            key={href}
            href={href}
            class={`nat-topbar-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </a>
        )
      })}
    </nav>
  )
}

// prescript fallback: derive html[data-page] from the first pathname segment for
// any page whose own component static didn't set it (CV, Writing, Wiki, ...).
// Landing/research statics run too and win if they fire first; this only fills
// the value when unset.
Topbar.beforeDOMLoaded = `
  var el = document.documentElement;
  if (!el.dataset.page) {
    var p = location.pathname || "/";
    var seg = (p.match(/^\\/([A-Za-z0-9_-]+)/) || [])[1] || "";
    el.dataset.page = seg === "" || seg === "index.html" ? "index" : seg.toLowerCase();
  }
`

export default (() => Topbar) satisfies QuartzComponentConstructor
