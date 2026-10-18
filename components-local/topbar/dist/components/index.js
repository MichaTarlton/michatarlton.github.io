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
Topbar.beforeDOMLoaded = `(function () {
  var href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&display=swap";
  if (!document.querySelector('link[href="' + href + '"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.setAttribute("data-persist", "");
    document.head.appendChild(l);
  }
  var html = document.documentElement;
  var computed = (location.pathname.split("/").filter(Boolean)[0] || "index").toLowerCase();
  if (html.getAttribute("data-page") !== computed) {
    html.setAttribute("data-page", computed);
  }
})();`;
var Topbar_default = (() => Topbar);
export {
  Topbar_default as Topbar
};
