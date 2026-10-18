// components-local/footer/src/Footer.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var contacts = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" }
];
var Footer = () => /* @__PURE__ */ jsxs("footer", { class: "gr-footer", children: [
  /* @__PURE__ */ jsx("h2", { children: "Contact" }),
  /* @__PURE__ */ jsx("ul", { children: contacts.map(({ label, href }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href, children: label }) })) })
] });
var Footer_default = (() => Footer);
export {
  Footer_default as Footer
};
