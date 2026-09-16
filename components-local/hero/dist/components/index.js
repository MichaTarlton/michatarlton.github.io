// components-local/hero/src/Hero.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var Hero = ({ fileData }) => {
  if (fileData.slug !== "index") return null;
  const hero = fileData.frontmatter?.hero ?? {};
  const name = hero.name ?? "Mike Tarlton";
  const identity = hero.identity ?? "Neuro-AI researcher building brain-inspired learning systems.";
  const status = hero.status ?? "";
  return /* @__PURE__ */ jsx("section", { class: "hero", children: /* @__PURE__ */ jsxs("div", { class: "hero-text", children: [
    /* @__PURE__ */ jsx("p", { class: "micro-label hero-eyebrow", children: hero.eyebrow ?? "NeuroAI Researcher" }),
    /* @__PURE__ */ jsx("h1", { class: "hero-name", children: name }),
    /* @__PURE__ */ jsx("p", { class: "hero-identity", children: identity }),
    status && /* @__PURE__ */ jsxs("p", { class: "hero-status", children: [
      /* @__PURE__ */ jsx("span", { class: "status-dot", "aria-hidden": "true" }),
      status
    ] }),
    /* @__PURE__ */ jsxs("div", { class: "hero-ctas", children: [
      hero.primaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-primary", href: hero.primaryCta.href, children: hero.primaryCta.label }),
      hero.secondaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-secondary", href: hero.secondaryCta.href, children: hero.secondaryCta.label })
    ] })
  ] }) });
};
var Hero_default = (() => Hero);
export {
  Hero_default as Hero
};
