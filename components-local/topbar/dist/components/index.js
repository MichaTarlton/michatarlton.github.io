// components-local/topbar/src/Topbar.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var links = [
  { label: "Index", href: "/", section: "index" },
  { label: "Research", href: "/research/", section: "research" },
  { label: "Writing", href: "/writing/", section: "writing" },
  { label: "CV", href: "/cv/", section: "cv" },
  { label: "Cortex", href: "/wiki/", section: "wiki" }
];
var Topbar = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  return /* @__PURE__ */ jsxs("nav", { class: "gr-topbar", "aria-label": "Site", children: [
    /* @__PURE__ */ jsxs("div", { class: "gr-topbar__brand", children: [
      /* @__PURE__ */ jsx("span", { class: "gr-topbar__name display", children: "Mike Tarlton" }),
      /* @__PURE__ */ jsx("span", { class: "gr-topbar__coord annotation", children: "tarlton.info" })
    ] }),
    /* @__PURE__ */ jsx("div", { class: "gr-topbar__nav", children: links.map(({ label, href, section }, i) => {
      const active = slug === section || slug.startsWith(`${section}/`);
      return /* @__PURE__ */ jsxs(
        "a",
        {
          href,
          class: `gr-nav-link${active ? " is-active" : ""}`,
          "aria-current": active ? "page" : void 0,
          children: [
            /* @__PURE__ */ jsx("span", { class: "gr-nav-link__num", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx("span", { class: "gr-nav-link__label", children: label })
          ]
        }
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { class: "gr-topbar__status annotation", children: [
      /* @__PURE__ */ jsx("span", { children: "STATUS: OPEN TO" }),
      /* @__PURE__ */ jsx("span", { children: "RESEARCH POSITIONS" })
    ] })
  ] });
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
