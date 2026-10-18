import { QuartzComponent, QuartzComponentConstructor } from "../../../quartz/components/types"

/**
 * Graphic Realism footer — afterBody, non-index pages.
 * Task 1 scaffold: the contact block. Restyling to the track's contact band
 * (mono links, 2px rules) happens in Task 6.
 */
const contacts: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" },
]

const Footer: QuartzComponent = () => (
  <footer class="gr-footer">
    <h2>Contact</h2>
    <ul>
      {contacts.map(({ label, href }) => (
        <li>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>
  </footer>
)

export default (() => Footer) satisfies QuartzComponentConstructor
