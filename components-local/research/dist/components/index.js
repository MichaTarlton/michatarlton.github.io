// quartz/plugins/loader/conditions.ts
var globals = globalThis;
function sharedRegistry() {
  return globals.__quartzCustomConditions ??= /* @__PURE__ */ new Map();
}
function registerCondition(name, predicate) {
  sharedRegistry().set(name, predicate);
}

// components-local/research/src/ResearchPage.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
function isResearchSlug(slug) {
  return slug === "research/index" || slug.startsWith("research/");
}
var ink = "currentColor";
function rasterFigure(rhythms, tcap) {
  const rows = rhythms.map((r, i) => {
    const ticks = [];
    for (let t = 1; t <= 300; t += r) {
      const h = 10 + (i * 37 + t) % 14;
      ticks.push(/* @__PURE__ */ jsx("line", { x1: t * 0.66, y1: 14 + i * 14, x2: t * 0.66, y2: 14 + i * 14 + h }, t));
    }
    return /* @__PURE__ */ jsx("g", { opacity: 0.85, children: ticks }, i);
  });
  const edges = [];
  for (let t = tcap; t <= 300; t += tcap) {
    edges.push(
      /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: t * 0.66,
            y1: 14 + rhythms.length * 14,
            x2: t * 0.66,
            y2: 14 + rhythms.length * 14 + 8,
            opacity: 0.5
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: `M ${t * 0.66 - 3} ${14 + rhythms.length * 14 + 12} L ${t * 0.66} ${14 + rhythms.length * 14 + 5} L ${t * 0.66 + 3} ${14 + rhythms.length * 14 + 12}`,
            "stroke-width": "1.2"
          }
        )
      ] }, t)
    );
  }
  const tcol = tcap * 0.66 + 4;
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "none", stroke: ink, "stroke-width": "1.4", "stroke-linecap": "round", children: [
    /* @__PURE__ */ jsx("line", { x1: "0", y1: "78", x2: "200", y2: "78", opacity: "0.3" }),
    rows,
    edges,
    /* @__PURE__ */ jsx("line", { x1: tcol, y1: "6", x2: tcol, y2: "78", "stroke-dasharray": "2 3", opacity: "0.4" }),
    /* @__PURE__ */ jsx(
      "text",
      {
        x: tcol + 2,
        y: "70",
        fill: ink,
        stroke: "none",
        "font-size": "5",
        "font-family": "var(--codeFont)",
        children: "T_C"
      }
    )
  ] });
}
function attractorFigure() {
  const points = [];
  for (let i = 0; i < 260; i++) {
    const a = i * 0.075;
    const x = 100 + 74 * Math.cos(a) * (0.5 + 0.5 * Math.sin(a * 0.35));
    const y = 40 + 30 * Math.sin(a * 2) * Math.cos(a * 0.8);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  for (let i = 0; i < 90; i++) {
    const a = i * 0.22 + 1.9;
    const x = 100 + 60 * Math.cos(a) * (0.5 + 0.5 * Math.cos(a * 0.5));
    const y = 40 + 24 * Math.sin(a * 1.7);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "none", stroke: ink, "stroke-width": "1", "stroke-linecap": "round", children: [
    /* @__PURE__ */ jsx("line", { x1: "0", y1: "78", x2: "200", y2: "78", opacity: "0.3" }),
    /* @__PURE__ */ jsx("path", { d: `M ${points.join(" L ")}` })
  ] });
}
function latticeFigure() {
  const up = (x, y, o) => /* @__PURE__ */ jsx(
    "path",
    {
      d: `M ${x} ${y} l ${o} ${-6} l ${-o - 1} ${-6.5} Z`,
      fill: ink,
      stroke: "none",
      opacity: 0.75
    },
    `${x}-${y}`
  );
  const down = (x, y, o) => /* @__PURE__ */ jsx(
    "path",
    {
      d: `M ${x} ${y} l ${-o} ${6} l ${o + 1} ${6.5} Z`,
      fill: ink,
      stroke: "none",
      opacity: 0.4
    },
    `${x}-${y}`
  );
  const figs = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const x = 24 + c * 40;
      const y = 20 + r * 22 + c % 2 * 6;
      figs.push(up(x, y, 5), down(x + 12, y + 12, 5));
    }
  }
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "none", stroke: ink, "stroke-width": "1.2", "stroke-linecap": "round", children: [
    /* @__PURE__ */ jsx("line", { x1: "0", y1: "78", x2: "200", y2: "78", opacity: "0.3" }),
    figs
  ] });
}
var projects = [
  {
    n: "01",
    slug: "ner-2025",
    name: "SBF-Automata",
    status: "Published",
    venue: "Principal author \xB7 Spotlight poster \xB7 IEEE NER 2025 \xB7 San Diego",
    year: "2025",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata \xB7 IEEE NER 2025",
    blurb: "I transposed the striatal beat-frequency model into a reinforcement-learning automaton that learns intervals online, encoded directly in its weights, and showed it works at the edge in O(N) localized updates \u2014 no central clock, no global error signal.",
    summary: "Periodicity finding is a workload the brain does for free and machines do expensively. I built a reinforcement-learning automaton from the striatal beat-frequency model of interval timing: a bank of oscillating units whose weights learn which periodicities predict reward, updating locally and online. Against FFT, autocorrelation and Autoperiod, SBF-A matched or beat them in speed, stability and accuracy \u2014 in O(N) per update, suited to neuromorphic edge hardware.",
    outputs: [
      {
        label: "Paper PDF",
        href: "/attachments/EMBS NER 2025 - Investigation of Novel SBF-Automata Architecture for Periodicity Finding Solutions at Edge Systems - Tarlton.pdf"
      }
    ],
    fig: rasterFigure([3, 6, 12, 24, 36, 48], 24)
  },
  {
    n: "02",
    slug: "phd-overview",
    name: "PhD Research Overview",
    status: "In progress",
    venue: "PhD candidate \xB7 Artificial intelligence \xB7 Oslo Metropolitan University",
    year: "2022\u2013",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD Research \xB7 OsloMet",
    blurb: "My doctoral programme designs learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics \u2014 for online, always-on, low-energy learning machines.",
    summary: "Biological brains compute with time \u2014 spike intervals, synchrony, oscillations \u2014 and artificial networks largely ignore it. My PhD asks whether the brain's time-based mechanisms can become practical learning rules: spike-timing plasticity as a learning signal, oscillator-based computation, and temporal structure that emerges from the plasticity of individual neurons. The goal is machine learning that is online, always-on, and radically low-energy.",
    outputs: [
      { label: "Poster", href: "/research/ner-2025/" },
      { label: "Essay", href: "/wiki/" }
    ],
    fig: attractorFigure()
  },
  {
    n: "03",
    slug: "masters-thesis",
    name: "MSc Thesis \u2014 Model Selection for Ising Inference",
    status: "Published",
    venue: "M.Sc. neuroscience \xB7 Kavli Institute, NTNU \xB7 Roudi group",
    year: "2021",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc Thesis \xB7 Kavli Institute, NTNU",
    blurb: "I derived and tested an information-based Bayesian criterion for choosing among Ising-model networks when inferring connectivity from neural spiking \u2014 designed, simulated, and evaluated on HPC clusters.",
    summary: "Record a population of neurons and you can ask how its cells are connected \u2014 but every answer depends on the model you choose to infer with: too simple misses structure, too complex fits noise. My thesis evaluated a novel information-based Bayesian criterion for exactly this choice, across candidate Ising-model topologies, simulated at scale on NTNU's IDUN cluster.",
    outputs: [
      {
        label: "Thesis PDF",
        href: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2783337?locale-attribute=en"
      }
    ],
    fig: latticeFigure()
  }
];
var also = [
  {
    label: "Oscillatory Timing Models in RL-Automata (AAMAS 2024)",
    meta: "Poster \xB7 PDF",
    href: "/attachments/aamas-2024-oscillatory-timing-models.pdf"
  },
  {
    label: "Experiencing a Slice of the Sky: Immersive Rendering and Sonification of Antarctic Astronomy Data",
    meta: "Mixed-media installation \xB7 xREZ Art + Science Lab, UNT",
    href: "https://doi.org/10.2352/ISSN.2470-1173.2018.03.ERVR-449"
  }
];
var fmtName = (s) => s.slice(0, 1) + s.slice(1).toLowerCase();
var fmtSlug = (s) => s.replace(/-/g, " ");
var SectionCard = ({ p }) => /* @__PURE__ */ jsxs("a", { class: "r-card", href: `/research/${p.slug}/`, children: [
  /* @__PURE__ */ jsxs("div", { class: "r-card-top", children: [
    /* @__PURE__ */ jsx("span", { class: "r-n", children: p.n }),
    /* @__PURE__ */ jsx("span", { class: `r-badge${p.status === "Published" ? " r-badge-solid" : ""}`, children: p.status })
  ] }),
  /* @__PURE__ */ jsx("div", { class: "r-fig", children: p.fig }),
  /* @__PURE__ */ jsx("h3", { class: "q", children: p.q }),
  /* @__PURE__ */ jsx("p", { class: "r-meta", children: p.meta }),
  /* @__PURE__ */ jsx("p", { class: "r-blurb", children: p.blurb })
] });
var AlsoList = () => /* @__PURE__ */ jsxs("section", { class: "r-also", children: [
  /* @__PURE__ */ jsx("div", { class: "section-head", children: /* @__PURE__ */ jsx("h2", { children: "Also" }) }),
  /* @__PURE__ */ jsx("ul", { children: also.map((a) => /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsx("a", { href: a.href, children: a.label }),
    /* @__PURE__ */ jsx("span", { class: "r-also-meta", children: a.meta })
  ] }, a.href)) }),
  /* @__PURE__ */ jsxs("a", { class: "r-door", href: "/wiki/", children: [
    "Enter the Cortex ",
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2192" })
  ] })
] });
var Hub = () => /* @__PURE__ */ jsxs("div", { class: "research hub", children: [
  /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "Research" }),
  /* @__PURE__ */ jsx("h1", { class: "display", children: "Research" }),
  /* @__PURE__ */ jsx("p", { class: "r-lede r-lede-short", children: "The work below is grouped by the questions it answers, not the papers it produced." }),
  /* @__PURE__ */ jsxs("section", { class: "r-band", children: [
    /* @__PURE__ */ jsx("div", { class: "r-band-grid", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { class: "r-band-inner", children: [
      /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "01 \xB7 Time" }),
      /* @__PURE__ */ jsx("h2", { class: "q", children: "Time, learned by machines" }),
      /* @__PURE__ */ jsxs("div", { class: "r-grid", children: [
        /* @__PURE__ */ jsx(SectionCard, { p: projects[0] }),
        /* @__PURE__ */ jsx(SectionCard, { p: projects[1] })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxs("section", { class: "r-band", children: [
    /* @__PURE__ */ jsx("div", { class: "r-band-grid", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { class: "r-band-inner", children: [
      /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "02 \xB7 Model selection" }),
      /* @__PURE__ */ jsx("h2", { class: "q", children: "Reading structure out of data" }),
      /* @__PURE__ */ jsx("div", { class: "r-grid", children: /* @__PURE__ */ jsx(SectionCard, { p: projects[2] }) })
    ] })
  ] }),
  /* @__PURE__ */ jsx(AlsoList, {})
] });
var Project = ({ p }) => /* @__PURE__ */ jsxs("div", { class: "research page", children: [
  /* @__PURE__ */ jsxs("div", { class: "r-cover", children: [
    /* @__PURE__ */ jsx("div", { class: "r-band-grid", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { class: "r-cover-inner", children: [
      /* @__PURE__ */ jsxs("p", { class: "r-breadcrumb", children: [
        "Research \xB7 ",
        p.n
      ] }),
      /* @__PURE__ */ jsxs("header", { class: "r-head", children: [
        /* @__PURE__ */ jsx("h1", { class: "display", children: p.name }),
        /* @__PURE__ */ jsx("p", { class: "r-q", children: p.q }),
        /* @__PURE__ */ jsxs("div", { class: "r-meta-row", children: [
          /* @__PURE__ */ jsx("span", { children: p.venue }),
          /* @__PURE__ */ jsx("span", { class: "r-dot", "aria-hidden": "true", children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: p.year }),
          /* @__PURE__ */ jsx("span", { class: `r-badge${p.status === "Published" ? " r-badge-solid" : ""}`, children: p.status })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { class: "r-fig", children: p.fig }),
      /* @__PURE__ */ jsx("span", { class: "r-fig-cap", children: "Page Figure \u2014 static frame. Real per-page figures land in a later ticket." })
    ] })
  ] }),
  /* @__PURE__ */ jsxs("div", { class: "r-sheet", children: [
    /* @__PURE__ */ jsxs("div", { class: "r-outputs", children: [
      /* @__PURE__ */ jsx("p", { class: "kicker", children: "Outputs" }),
      /* @__PURE__ */ jsx("div", { class: "r-pills", children: p.outputs.map((o) => /* @__PURE__ */ jsx("a", { class: "pill pill-link", href: o.href, children: o.label }, o.label)) })
    ] }),
    /* @__PURE__ */ jsx("p", { class: "r-summary", children: p.summary })
  ] })
] });
var ResearchPage = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  if (!isResearchSlug(slug)) return null;
  if (slug === "research/index") return /* @__PURE__ */ jsx(Hub, {});
  const p = projects.find((proj) => slug.startsWith(`research/${proj.slug}`));
  if (p) return /* @__PURE__ */ jsx(Project, { p });
  return /* @__PURE__ */ jsxs("div", { class: "research", children: [
    /* @__PURE__ */ jsx("p", { class: "r-breadcrumb", children: "Research" }),
    /* @__PURE__ */ jsx("h1", { class: "display", children: fmtName(fmtSlug(slug.replace("research/", "").replace("/index", ""))) })
  ] });
};
ResearchPage.beforeDOMLoaded = `(function(){
  // Light is the design; force light on research pages unless ?dark.
  var p=new URLSearchParams(location.search);
  if(!p.has("dark")){localStorage.setItem("theme","light");document.documentElement.setAttribute("saved-theme","light");}
})();`;
var ResearchPage_default = (() => ResearchPage);

// components-local/research/src/index.ts
function isResearchSlug2(slug) {
  return slug === "research/index" || slug.startsWith("research/");
}
registerCondition("is-research", (props) => isResearchSlug2(props.fileData.slug ?? ""));
registerCondition("not-research", (props) => !isResearchSlug2(props.fileData.slug ?? ""));
registerCondition("not-index-not-research", (props) => {
  const slug = props.fileData.slug ?? "";
  return slug !== "index" && !isResearchSlug2(slug);
});
export {
  ResearchPage_default as ResearchPage,
  isResearchSlug2 as isResearchSlug
};
