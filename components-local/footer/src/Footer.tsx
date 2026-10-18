import { QuartzComponent, QuartzComponentConstructor } from "../../../quartz/components/types"

/**
 * Natural track footer — contact block on non-index pages (Task 1 scaffold).
 * Contact set fixed by the brief.
 */
const contacts: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" },
]

const Footer: QuartzComponent = () => (
  <div class="nat-footer">
    <h2 class="nat-footer-heading">Contact</h2>
    {contacts.map((c) => (
      <a class="nat-footer-link" key={c.href} href={c.href}>
        {c.label}
      </a>
    ))}
  </div>
)

export default (() => Footer) satisfies QuartzComponentConstructor
