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
      <span class="nat-topbar__mark" aria-hidden="true">
        <svg
          class="nat-handmark nat-handmark--sprig"
          viewBox="0 0 48 48"
          focusable="false"
          fill="none"
        >
          <path
            d="M24 44 C 23.4 36, 24.4 30, 23.6 24 M23.6 24 C 19 19, 14 17, 9 11 M23.6 24 C 28 18, 32 16, 38 9 M23.6 24 C 23.2 18, 24 12, 23.4 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="9" cy="11" r="2" class="nat-handmark__leaf" />
          <circle cx="38" cy="9" r="2" class="nat-handmark__leaf" />
          <circle cx="23.4" cy="6" r="2" class="nat-handmark__leaf" />
        </svg>
      </span>
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

/**
 * beforeDOMLoaded: derive html[data-page] from the first pathname segment.
 *
 * The prescript is emitted with data-persist (engine behaviour in this fork),
 * so it executes ONCE per page load — it does NOT re-run after an SPA head
 * patch. To keep data-page correct across client-side navigations (GR-lane
 * finding 1: a stale "research" would otherwise follow /research/ -> /cv/ and
 * break prose chrome), we also listen for Quartz's "nav" event, which fires
 * after history.pushState. Landing/research seed the identical pathname-derived
 * value on their own pages (seed-only, guarded by hasAttribute), so this never
 * clobbers them.
 */
Topbar.beforeDOMLoaded = `(function () {
  var html = document.documentElement;
  function update() {
    var computed = (location.pathname.split("/").filter(Boolean)[0] || "index").toLowerCase();
    if (computed === "index.html") computed = "index";
    if (html.getAttribute("data-page") !== computed) {
      html.setAttribute("data-page", computed);
    }
  }
  update();
  document.addEventListener("nav", update);
})();`

export default (() => Topbar) satisfies QuartzComponentConstructor
