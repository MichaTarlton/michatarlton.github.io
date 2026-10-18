// components-local/footer/src/Footer.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var contacts = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" }
];
var Footer = () => /* @__PURE__ */ jsxs("div", { class: "nat-footer", children: [
  /* @__PURE__ */ jsxs("p", { class: "nat-footer__note voice", children: [
    "I answer quickly. Write me at ",
    /* @__PURE__ */ jsx("a", { href: "mailto:M@Tarlton.info", children: "M@Tarlton.info" }),
    ", or find me on",
    " ",
    /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/m-tarlton/", target: "_blank", rel: "noopener", children: "LinkedIn" }),
    " ",
    "and",
    " ",
    /* @__PURE__ */ jsx("a", { href: "https://github.com/MichaTarlton", target: "_blank", rel: "noopener", children: "GitHub" }),
    "."
  ] }),
  /* @__PURE__ */ jsx("nav", { class: "nat-footer__links", "aria-label": "Contact", children: contacts.map((c) => /* @__PURE__ */ jsx(
    "a",
    {
      class: "nat-footer-link nat-mono",
      href: c.href,
      target: c.href.startsWith("/") ? void 0 : c.href.startsWith("mailto:") ? void 0 : "_blank",
      rel: c.href.startsWith("http") ? "noopener" : void 0,
      children: c.label
    },
    c.href
  )) }),
  /* @__PURE__ */ jsx(
    "svg",
    {
      class: "nat-handmark nat-handmark--stroke nat-footer__stroke",
      "aria-hidden": "true",
      focusable: "false",
      viewBox: "0 0 120 8",
      preserveAspectRatio: "none",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M1 5 C 15 3, 30 6.5, 45 4 S 75 2.5, 92 5 S 112 4, 119 3.5",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.4",
          strokeLinecap: "round",
          vectorEffect: "non-scaling-stroke"
        }
      )
    }
  )
] });
var Footer_default = (() => Footer);
export {
  Footer_default as Footer
};
