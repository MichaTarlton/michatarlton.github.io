import { QuartzComponent, QuartzComponentConstructor } from "../../../quartz/components/types"

/**
 * Natural track footer (Task 6) — contact band on non-index pages: italic
 * voice note + links on a hairline top rule, one hand-mark sketch stroke.
 * The sketch stroke is the same inline SVG as landing's `SketchStroke`
 * (components-local/landing/src/marks.tsx); inlined here on purpose so the
 * footer stays independent of the landing bundle.
 * Contact set fixed by the brief.
 */
const contacts: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" },
]

const Footer: QuartzComponent = () => (
  <div class="nat-footer">
    <p class="nat-footer__note voice">
      I answer quickly. Write me at <a href="mailto:M@Tarlton.info">M@Tarlton.info</a>, or find me
      on{" "}
      <a href="https://www.linkedin.com/in/m-tarlton/" target="_blank" rel="noopener">
        LinkedIn
      </a>{" "}
      and{" "}
      <a href="https://github.com/MichaTarlton" target="_blank" rel="noopener">
        GitHub
      </a>
      .
    </p>
    <nav class="nat-footer__links" aria-label="Contact">
      {contacts.map((c) => (
        <a
          class="nat-footer-link nat-mono"
          key={c.href}
          href={c.href}
          target={
            c.href.startsWith("/") ? undefined : c.href.startsWith("mailto:") ? undefined : "_blank"
          }
          rel={c.href.startsWith("http") ? "noopener" : undefined}
        >
          {c.label}
        </a>
      ))}
    </nav>
    <svg
      class="nat-handmark nat-handmark--stroke nat-footer__stroke"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
    >
      <path
        d="M1 5 C 15 3, 30 6.5, 45 4 S 75 2.5, 92 5 S 112 4, 119 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </div>
)

export default (() => Footer) satisfies QuartzComponentConstructor
