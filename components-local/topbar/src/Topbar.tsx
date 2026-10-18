import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../../quartz/components/types"

/**
 * Graphic Realism topbar — header slot.
 * Task 1 scaffold: the nav set with active state. Name lockup, numbered mono
 * nav, status block and the mobile top-strip land in Task 6.
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
    <nav class="gr-topbar" aria-label="Site">
      {links.map(({ label, href, section }) => {
        const active = slug === section || slug.startsWith(`${section}/`)
        return (
          <a
            href={href}
            class={`gr-nav-link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </a>
        )
      })}
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
