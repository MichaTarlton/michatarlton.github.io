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

export default (() => Topbar) satisfies QuartzComponentConstructor
