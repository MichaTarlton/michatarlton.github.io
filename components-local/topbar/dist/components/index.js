// components-local/topbar/src/Topbar.tsx
import { jsx } from "preact/jsx-runtime";
var links = [
  { label: "Index", href: "/", section: "index" },
  { label: "Research", href: "/research/", section: "research" },
  { label: "CV", href: "/cv/", section: "cv" },
  { label: "Writing", href: "/writing/", section: "writing" },
  { label: "Wiki", href: "/wiki/", section: "wiki" }
];
var Topbar = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  return /* @__PURE__ */ jsx("nav", { class: "gr-topbar", "aria-label": "Site", children: links.map(({ label, href, section }) => {
    const active = slug === section || slug.startsWith(`${section}/`);
    return /* @__PURE__ */ jsx(
      "a",
      {
        href,
        class: `gr-nav-link${active ? " is-active" : ""}`,
        "aria-current": active ? "page" : void 0,
        children: label
      }
    );
  }) });
};
var Topbar_default = (() => Topbar);
export {
  Topbar_default as Topbar
};
