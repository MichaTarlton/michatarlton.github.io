// components-local/footer/src/Footer.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var contacts = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" }
];
var Footer = () => /* @__PURE__ */ jsxs("div", { class: "nat-footer", children: [
  /* @__PURE__ */ jsx("h2", { class: "nat-footer-heading", children: "Contact" }),
  contacts.map((c) => /* @__PURE__ */ jsx("a", { class: "nat-footer-link", href: c.href, children: c.label }, c.href))
] });
var Footer_default = (() => Footer);
export {
  Footer_default as Footer
};
