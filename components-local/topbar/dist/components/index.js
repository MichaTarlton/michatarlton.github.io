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
  return /* @__PURE__ */ jsx("nav", { class: "nat-topbar", "aria-label": "Site", children: links.map(({ label, href, section }) => {
    const active = section === "index" ? slug === "index" : slug.startsWith(`${section}/`);
    return /* @__PURE__ */ jsx(
      "a",
      {
        href,
        class: `nat-topbar-link${active ? " active" : ""}`,
        "aria-current": active ? "page" : void 0,
        children: label
      },
      href
    );
  }) });
};
Topbar.beforeDOMLoaded = `
  var el = document.documentElement;
  if (!el.dataset.page) {
    var p = location.pathname || "/";
    var seg = (p.match(/^\\/([A-Za-z0-9_-]+)/) || [])[1] || "";
    el.dataset.page = seg === "" || seg === "index.html" ? "index" : seg.toLowerCase();
  }
`;
var Topbar_default = (() => Topbar);
export {
  Topbar_default as Topbar
};
