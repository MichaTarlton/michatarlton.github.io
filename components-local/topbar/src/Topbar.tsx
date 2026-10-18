import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

/**
 * Graphic Realism topbar — header slot (Task 6 final).
 * Desktop ≥800px on index/research: fixed left rail (name lockup, numbered
 * mono nav, status block at the bottom). Everywhere else (<800px, and the
 * content pages at any width) it renders as the horizontal top-strip; the
 * variant is CSS-driven (body[data-slug] / width media queries), the markup
 * contract is one shape: gr-topbar > brand + nav + status.
 * The CORTEX label is the door concept for /wiki/ (the URL stays /wiki/).
 */
const links: { label: string; href: string; section: string }[] = [
  { label: "Index", href: "/", section: "index" },
  { label: "Research", href: "/research/", section: "research" },
  { label: "Writing", href: "/writing/", section: "writing" },
  { label: "CV", href: "/cv/", section: "cv" },
  { label: "Cortex", href: "/wiki/", section: "wiki" },
]

const Topbar: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  return (
    <nav class="gr-topbar" aria-label="Site">
      <div class="gr-topbar__brand">
        <span class="gr-topbar__name display">Mike Tarlton</span>
        <span class="gr-topbar__coord annotation">tarlton.info</span>
      </div>
      <div class="gr-topbar__nav">
        {links.map(({ label, href, section }, i) => {
          const active = slug === section || slug.startsWith(`${section}/`)
          return (
            <a
              href={href}
              class={`gr-nav-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span class="gr-nav-link__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span class="gr-nav-link__label">{label}</span>
            </a>
          )
        })}
      </div>
      <div class="gr-topbar__status annotation">
        <span>STATUS: OPEN TO</span>
        <span>RESEARCH POSITIONS</span>
      </div>
    </nav>
  )
}

/**
 * beforeDOMLoaded (static string, re-runs on every SPA navigation because the
 * prescript has no data-persist):
 *  - Fraunces italic voice font, injected as <link data-persist> so the SPA
 *    head patching never removes it (round-1 lesson: the file must persist).
 *  - html[data-page]: set from pathname, refreshing a stale value left over
 *    from an SPA navigation. Landing/research also set it explicitly; the
 *    pathname-derived value is identical on those pages, so this fallback
 *    never clobbers them.
 */
Topbar.beforeDOMLoaded = `(function () {
  var href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&display=swap";
  if (!document.querySelector('link[href="' + href + '"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.setAttribute("data-persist", "");
    document.head.appendChild(l);
  }
  var html = document.documentElement;
  var computed = (location.pathname.split("/").filter(Boolean)[0] || "index").toLowerCase();
  if (html.getAttribute("data-page") !== computed) {
    html.setAttribute("data-page", computed);
  }
})();`

export default (() => Topbar) satisfies QuartzComponentConstructor
