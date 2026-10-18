// quartz/plugins/loader/conditions.ts
var globals = globalThis;
function sharedRegistry() {
  return globals.__quartzCustomConditions ??= /* @__PURE__ */ new Map();
}
function registerCondition(name, predicate) {
  sharedRegistry().set(name, predicate);
}

// components-local/landing/src/Landing.tsx
import { jsx } from "preact/jsx-runtime";
var Landing = ({ fileData }) => {
  const hero = fileData.frontmatter?.hero ?? {};
  return /* @__PURE__ */ jsx("div", { class: "nat-landing", children: /* @__PURE__ */ jsx("h1", { class: "nat-landing-name", children: hero.name ?? "Mike Tarlton" }) });
};
var Landing_default = (() => Landing);

// components-local/landing/src/index.ts
registerCondition("is-index", (props) => props.fileData.slug === "index");
export {
  Landing_default as Landing
};
