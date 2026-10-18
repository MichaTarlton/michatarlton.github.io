// components-local/topbar/src/Topbar.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var links = [
  { label: "Index", href: "/", section: "index" },
  { label: "Research", href: "/research/", section: "research" },
  { label: "CV", href: "/cv/", section: "cv" },
  { label: "Writing", href: "/writing/", section: "writing" },
  { label: "Wiki", href: "/wiki/", section: "wiki" }
];
var Topbar = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  return /* @__PURE__ */ jsxs("nav", { class: "nat-topbar", "aria-label": "Site", children: [
    /* @__PURE__ */ jsx("span", { class: "nat-topbar__mark", "aria-hidden": "true", children: /* @__PURE__ */ jsxs(
      "svg",
      {
        class: "nat-handmark nat-handmark--sprig",
        viewBox: "0 0 48 48",
        focusable: "false",
        fill: "none",
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M24 44 C 23.4 36, 24.4 30, 23.6 24 M23.6 24 C 19 19, 14 17, 9 11 M23.6 24 C 28 18, 32 16, 38 9 M23.6 24 C 23.2 18, 24 12, 23.4 6",
              stroke: "currentColor",
              strokeWidth: "1.4",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsx("circle", { cx: "9", cy: "11", r: "2", class: "nat-handmark__leaf" }),
          /* @__PURE__ */ jsx("circle", { cx: "38", cy: "9", r: "2", class: "nat-handmark__leaf" }),
          /* @__PURE__ */ jsx("circle", { cx: "23.4", cy: "6", r: "2", class: "nat-handmark__leaf" })
        ]
      }
    ) }),
    links.map(({ label, href, section }) => {
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
    })
  ] });
};
Topbar.beforeDOMLoaded = `(function () {
  var html = document.documentElement;
  function update() {
    var computed = (location.pathname.split("/").filter(Boolean)[0] || "index").toLowerCase();
    if (computed === "index.html") computed = "index";
    if (html.getAttribute("data-page") !== computed) {
      html.setAttribute("data-page", computed);
    }
  }
  update();
  document.addEventListener("nav", update);
})();`;
var Topbar_default = (() => Topbar);
export {
  Topbar_default as Topbar
};
