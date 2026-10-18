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
var nerRasterSeed = {
  rhythms: [3, 6, 12, 24, 36, 48],
  tcap: 24
};
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
var also = [
  {
    label: "Oscillatory Timing Models in RL-Automata (AAMAS 2024)",
    meta: "Poster (PDF)",
    href: "/attachments/aamas-2024-oscillatory-timing-models.pdf"
  },
  {
    label: "Experiencing a Slice of the Sky: Immersive Rendering and Sonification of Antarctic Astronomy Data",
    meta: "Mixed-media installation, xREZ Art + Science Lab, UNT",
    href: "https://doi.org/10.2352/ISSN.2470-1173.2018.03.ERVR-449"
  }
];

// components-local/research/src/hub.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
function ResearchHub() {
  return /* @__PURE__ */ jsxs("section", { class: "gr-hub", "aria-label": "Research index", children: [
    /* @__PURE__ */ jsxs("div", { class: "gr-hub__head", children: [
      /* @__PURE__ */ jsx("h1", { class: "gr-hub__title display", children: "Research" }),
      /* @__PURE__ */ jsxs("p", { class: "gr-hub__count annotation", children: [
        String(projects.length).padStart(2, "0"),
        " PROJECTS"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { class: "gr-hub__table", children: projects.map((p, i) => /* @__PURE__ */ jsxs("a", { class: "gr-hub__row", href: `/research/${p.slug}/`, children: [
      /* @__PURE__ */ jsxs("span", { class: "gr-hub__gutter", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxs("span", { class: "gr-hub__fig", children: [
          "FIG. ",
          String(i + 1).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsx("span", { class: "gr-hub__numeral display", children: String(i + 1).padStart(2, "0") })
      ] }),
      /* @__PURE__ */ jsxs("span", { class: "gr-hub__body", children: [
        /* @__PURE__ */ jsx("span", { class: "gr-hub__q voice", children: p.q }),
        /* @__PURE__ */ jsxs("span", { class: "gr-hub__meta", children: [
          /* @__PURE__ */ jsx("span", { class: "gr-hub__name", children: p.name }),
          /* @__PURE__ */ jsx("span", { class: "gr-hub__badge", children: p.status })
        ] }),
        /* @__PURE__ */ jsx("span", { class: "gr-hub__venue annotation", children: p.venue }),
        /* @__PURE__ */ jsx("span", { class: "gr-hub__blurb", children: p.blurb })
      ] })
    ] }, p.slug)) }),
    /* @__PURE__ */ jsxs("div", { class: "gr-hub__also", children: [
      /* @__PURE__ */ jsx("p", { class: "gr-hub__also-label annotation", children: "ALSO" }),
      /* @__PURE__ */ jsx("ul", { children: also.map((a) => /* @__PURE__ */ jsxs("li", { class: "gr-hub__also-item annotation", children: [
        /* @__PURE__ */ jsx("a", { href: a.href, children: a.label }),
        " \xB7 ",
        a.meta
      ] }, a.href)) })
    ] })
  ] });
}

// components-local/research/src/figures.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "preact/jsx-runtime";
var monoTag = "font-family: var(--codeFont); font-size: 10px; letter-spacing: 0.08em;";
var inkText = `${monoTag} fill: var(--ink);`;
var grayText = `${monoTag} fill: var(--gray);`;
var inkLine = "stroke: var(--ink); stroke-width: 2; fill: none;";
var accentLine = "stroke: var(--accent); stroke-width: 2; fill: none;";
function FigTag({ x, y, text }) {
  return /* @__PURE__ */ jsx2("text", { x, y, style: inkText, children: text });
}
function NerRasterFigure() {
  const { rhythms, tcap } = nerRasterSeed;
  const PX = 5;
  const TMAX = 96;
  const X0 = 88;
  const Y0 = 72;
  const DY = 28;
  const ticks = (T) => {
    const out = [];
    for (let t = T; t <= TMAX; t += T) out.push(X0 + t * PX);
    return out;
  };
  const spikes = [];
  for (let t = tcap; t <= TMAX; t += tcap) spikes.push(X0 + t * PX);
  return /* @__PURE__ */ jsxs2(
    "svg",
    {
      class: "gr-fig",
      viewBox: "0 0 640 260",
      role: "img",
      "aria-label": "Oscillator bank raster: tick rows per period, spike edges at criterion-time multiples",
      children: [
        /* @__PURE__ */ jsx2(FigTag, { x: 16, y: 28, text: "FIG. 01" }),
        /* @__PURE__ */ jsx2("line", { x1: X0, y1: 48, x2: X0 + TMAX * PX, y2: 48, style: inkLine }),
        spikes.map((x, i) => /* @__PURE__ */ jsx2("text", { x, y: 40, "text-anchor": "middle", style: grayText, children: tcap * (i + 1) })),
        rhythms.map((T, i) => {
          const y = Y0 + i * DY;
          return /* @__PURE__ */ jsxs2("g", { children: [
            /* @__PURE__ */ jsxs2("text", { x: X0 - 12, y: y + 4, "text-anchor": "end", style: grayText, children: [
              "T=",
              T
            ] }),
            /* @__PURE__ */ jsx2("g", { style: inkLine, children: ticks(T).map((x) => /* @__PURE__ */ jsx2("line", { x1: x, y1: y - 7, x2: x, y2: y + 7 })) }),
            /* @__PURE__ */ jsx2("g", { style: accentLine, children: spikes.map((x) => /* @__PURE__ */ jsx2("line", { x1: x, y1: y - 11, x2: x, y2: y + 11 })) })
          ] }, `row-${T}`);
        }),
        /* @__PURE__ */ jsx2("text", { x: 16, y: 246, style: grayText, children: "\u0394\u03C6_i = dt / T_i" })
      ]
    }
  );
}
function PhdAttractorFigure() {
  const CX = 360;
  const CY = 130;
  const shells = [36, 64, 92, 120];
  const pt = (r, deg) => [
    +(CX + r * Math.cos(deg * Math.PI / 180)).toFixed(2),
    +(CY + r * Math.sin(deg * Math.PI / 180)).toFixed(2)
  ];
  const arcPath = (r) => {
    const [x0, y0] = pt(r, 100);
    const [x1, y1] = pt(r, 420);
    return `M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`;
  };
  const trajectory = [];
  for (let t = 0; t <= 720; t += 24) {
    const r = 120 - t * 0.12;
    const [x, y] = pt(r, t);
    trajectory.push(`${x},${y}`);
  }
  const [sx, sy] = pt(120, 0);
  return /* @__PURE__ */ jsxs2(
    "svg",
    {
      class: "gr-fig",
      viewBox: "0 0 640 260",
      role: "img",
      "aria-label": "Attractor diagram: concentric shells with a trajectory spiralling inward",
      children: [
        /* @__PURE__ */ jsx2(FigTag, { x: 16, y: 28, text: "FIG. 02" }),
        /* @__PURE__ */ jsxs2("g", { style: inkLine, children: [
          shells.map((r) => /* @__PURE__ */ jsx2("path", { d: arcPath(r) })),
          /* @__PURE__ */ jsx2("polyline", { points: trajectory.join(" ") })
        ] }),
        /* @__PURE__ */ jsx2("rect", { x: sx - 4, y: sy - 4, width: "8", height: "8", style: "fill: var(--accent)" }),
        /* @__PURE__ */ jsxs2("text", { x: 16, y: 246, style: grayText, children: [
          shells.length,
          " SHELLS \xB7 1 TRAJECTORY"
        ] })
      ]
    }
  );
}
function MastersLatticeFigure() {
  const COLS = 6;
  const ROWS = 4;
  const X0 = 120;
  const Y0 = 60;
  const DX = 80;
  const DY = 40;
  const accentNode = [1, 3];
  const px = (j) => X0 + j * DX;
  const py = (i) => Y0 + i * DY;
  return /* @__PURE__ */ jsxs2(
    "svg",
    {
      class: "gr-fig",
      viewBox: "0 0 640 240",
      role: "img",
      "aria-label": "Lattice diagram: grid of nodes joined by edges, one node marked",
      children: [
        /* @__PURE__ */ jsx2(FigTag, { x: 16, y: 28, text: "FIG. 03" }),
        /* @__PURE__ */ jsxs2("g", { style: inkLine, children: [
          Array.from(
            { length: ROWS },
            (_, i) => Array.from({ length: COLS - 1 }, (_2, j) => /* @__PURE__ */ jsx2("line", { x1: px(j), y1: py(i), x2: px(j + 1), y2: py(i) }))
          ),
          Array.from(
            { length: ROWS - 1 },
            (_, i) => Array.from({ length: COLS }, (_2, j) => /* @__PURE__ */ jsx2("line", { x1: px(j), y1: py(i), x2: px(j), y2: py(i + 1) }))
          )
        ] }),
        /* @__PURE__ */ jsx2("g", { style: "fill: var(--ink)", children: Array.from(
          { length: ROWS },
          (_, i) => Array.from(
            { length: COLS },
            (_2, j) => i === accentNode[0] && j === accentNode[1] ? null : /* @__PURE__ */ jsx2("rect", { x: px(j) - 4, y: py(i) - 4, width: "8", height: "8" })
          )
        ) }),
        /* @__PURE__ */ jsx2(
          "rect",
          {
            x: px(accentNode[1]) - 4,
            y: py(accentNode[0]) - 4,
            width: "8",
            height: "8",
            style: "fill: var(--accent)"
          }
        ),
        /* @__PURE__ */ jsxs2("text", { x: 16, y: 226, style: grayText, children: [
          "LATTICE ",
          COLS,
          "\xD7",
          ROWS,
          " \xB7 ISING"
        ] })
      ]
    }
  );
}
function ProjectFigure({ slug }) {
  switch (slug) {
    case "ner-2025":
      return /* @__PURE__ */ jsx2(NerRasterFigure, {});
    case "phd-overview":
      return /* @__PURE__ */ jsx2(PhdAttractorFigure, {});
    case "masters-thesis":
      return /* @__PURE__ */ jsx2(MastersLatticeFigure, {});
    default:
      return null;
  }
}

// components-local/research/src/project.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "preact/jsx-runtime";
function isExternal(href) {
  return /^(https?:|mailto:)/i.test(href);
}
function ResearchProject({ project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const numeral = index >= 0 ? String(index + 1).padStart(2, "0") : "00";
  return /* @__PURE__ */ jsxs3("section", { class: "gr-sheet", "aria-label": project.name, children: [
    /* @__PURE__ */ jsxs3("div", { class: "gr-sheet__head", children: [
      /* @__PURE__ */ jsxs3("div", { class: "gr-sheet__gutter", children: [
        /* @__PURE__ */ jsxs3("span", { class: "gr-sheet__fig annotation", children: [
          "FIG. ",
          numeral
        ] }),
        /* @__PURE__ */ jsx3("span", { class: "gr-sheet__numeral display", "aria-hidden": "true", children: numeral })
      ] }),
      /* @__PURE__ */ jsxs3("div", { class: "gr-sheet__titleblock", children: [
        /* @__PURE__ */ jsx3("h1", { class: "gr-sheet__name display", children: project.name }),
        /* @__PURE__ */ jsxs3("div", { class: "gr-sheet__meta", children: [
          /* @__PURE__ */ jsx3("span", { class: "gr-sheet__badge", children: project.status }),
          /* @__PURE__ */ jsx3("span", { class: "gr-sheet__venue annotation", children: project.venue })
        ] }),
        /* @__PURE__ */ jsx3("p", { class: "gr-sheet__q voice", children: project.q })
      ] })
    ] }),
    project.outputs.length > 0 && /* @__PURE__ */ jsxs3("div", { class: "gr-sheet__outputs", children: [
      /* @__PURE__ */ jsx3("span", { class: "gr-sheet__outputs-label annotation", children: "OUTPUTS" }),
      /* @__PURE__ */ jsx3("div", { class: "gr-sheet__outputs-row", children: project.outputs.map((o) => /* @__PURE__ */ jsxs3(
        "a",
        {
          class: "gr-sheet__out",
          href: o.href,
          ...isExternal(o.href) ? { target: "_blank", rel: "noreferrer noopener" } : {},
          children: [
            o.label,
            isExternal(o.href) && /* @__PURE__ */ jsx3("span", { class: "gr-sheet__ext", "aria-hidden": "true", children: " \u2197" })
          ]
        },
        o.href
      )) })
    ] }),
    /* @__PURE__ */ jsx3("figure", { class: "gr-sheet__plate", children: /* @__PURE__ */ jsx3(ProjectFigure, { slug: project.slug }) })
  ] });
}

// components-local/research/src/ResearchPage.tsx
import { jsx as jsx4 } from "preact/jsx-runtime";
var ResearchPage = ({ fileData }) => {
  const slug = fileData.slug ?? "";
  if (!isResearchSlug(slug)) return null;
  if (slug === "research/index") {
    return /* @__PURE__ */ jsx4("section", { class: "gr-research gr-research--hub", children: /* @__PURE__ */ jsx4(ResearchHub, {}) });
  }
  const projectSlug = slug.replace(/^research\//, "").replace(/\/index$/, "");
  const project = projects.find((p) => p.slug === projectSlug);
  if (!project) return null;
  return /* @__PURE__ */ jsx4("section", { class: `gr-research gr-research--project gr-research--${project.slug}`, children: /* @__PURE__ */ jsx4(ResearchProject, { project }) });
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
