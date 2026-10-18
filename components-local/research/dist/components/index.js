// quartz/plugins/loader/conditions.ts
var globals = globalThis;
function sharedRegistry() {
  return globals.__quartzCustomConditions ??= /* @__PURE__ */ new Map();
}
function registerCondition(name, predicate) {
  sharedRegistry().set(name, predicate);
}

// components-local/research/src/slug.ts
function isResearchSlug(slug) {
  return slug === "research/index" || slug.startsWith("research/");
}

// components-local/research/src/projects.ts
var projects = [
  {
    slug: "ner-2025",
    name: "SBF-Automata",
    status: "Published",
    venue: "Principal author, spotlight poster at IEEE NER 2025 in San Diego",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata, IEEE NER 2025",
    blurb: "I transposed the striatal beat-frequency model into a reinforcement-learning automaton that learns intervals online, encoded directly in its weights, and showed it works at the edge in O(N) localized updates, with no central clock and no global error signal.",
    summary: "Periodicity finding is a workload the brain does for free and machines do expensively. I built a reinforcement-learning automaton from the striatal beat-frequency model of interval timing: a bank of oscillating units whose weights learn which periodicities predict reward, updating locally and online. Against FFT, autocorrelation and Autoperiod, SBF-A matched or beat them in speed, stability and accuracy, in O(N) per update, suited to neuromorphic edge hardware.",
    outputs: [
      {
        label: "Paper PDF",
        href: "/attachments/EMBS NER 2025 - Investigation of Novel SBF-Automata Architecture for Periodicity Finding Solutions at Edge Systems - Tarlton.pdf"
      }
    ]
  },
  {
    slug: "phd-overview",
    name: "PhD Research Overview",
    status: "In progress",
    venue: "PhD candidate in artificial intelligence at Oslo Metropolitan University, since 2022",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD research, OsloMet",
    blurb: "My doctoral programme designs learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics, for online, always-on, low-energy learning machines.",
    summary: "Biological brains compute with time (spike intervals, synchrony, oscillations), and artificial networks largely ignore it. My PhD asks whether the brain's time-based mechanisms can become practical learning rules: spike-timing plasticity as a learning signal, oscillator-based computation, and temporal structure that emerges from the plasticity of individual neurons. The goal is machine learning that is online, always-on, and radically low-energy.",
    outputs: [
      { label: "Poster", href: "/research/ner-2025/" },
      { label: "Essay", href: "/wiki/" }
    ]
  },
  {
    slug: "masters-thesis",
    name: "MSc Thesis: Model Selection for Ising Inference",
    status: "Published",
    venue: "MSc in neuroscience, Roudi group, Kavli Institute at NTNU, 2021",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc thesis, Kavli Institute at NTNU",
    blurb: "I derived and tested an information-based Bayesian criterion for choosing among Ising-model networks when inferring connectivity from neural spiking, with the simulations and evaluation run on HPC clusters.",
    summary: "Record a population of neurons and you can ask how its cells are connected, but every answer depends on the model you choose to infer with: too simple misses structure, too complex fits noise. My thesis evaluated a novel information-based Bayesian criterion for exactly this choice, across candidate Ising-model topologies, simulated at scale on NTNU's IDUN cluster.",
    outputs: [
      {
        label: "Thesis PDF",
        href: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2783337?locale-attribute=en"
      }
    ]
  }
];

// components-local/research/src/ResearchPage.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var ResearchPage = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  if (!isResearchSlug(slug)) return null;
  if (slug === "research/index") {
    return /* @__PURE__ */ jsxs("section", { class: "gr-research gr-research-hub", children: [
      /* @__PURE__ */ jsx("h1", { children: "Research" }),
      projects.map((p) => /* @__PURE__ */ jsx("a", { class: "gr-research-row", href: `/research/${p.slug}/`, children: p.q }))
    ] });
  }
  const projectSlug = slug.replace(/^research\//, "");
  const project = projects.find((p) => p.slug === projectSlug);
  return /* @__PURE__ */ jsx("section", { class: "gr-research gr-research-project", children: /* @__PURE__ */ jsx("h1", { children: project?.name ?? projectSlug }) });
};
ResearchPage.beforeDOMLoaded = `(function () {
  document.documentElement.setAttribute("data-page", "research");
})();`;
var ResearchPage_default = (() => ResearchPage);

// components-local/research/src/index.ts
registerCondition("is-research", (props) => isResearchSlug(props.fileData.slug ?? ""));
registerCondition("not-research", (props) => !isResearchSlug(props.fileData.slug ?? ""));
registerCondition("not-index-not-research", (props) => {
  const slug = props.fileData.slug ?? "";
  return slug !== "index" && !isResearchSlug(slug);
});
export {
  ResearchPage_default as ResearchPage
};
