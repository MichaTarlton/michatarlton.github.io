// quartz/plugins/loader/conditions.ts
var globals = globalThis;
function sharedRegistry() {
  return globals.__quartzCustomConditions ??= /* @__PURE__ */ new Map();
}
function registerCondition(name, predicate) {
  sharedRegistry().set(name, predicate);
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

// components-local/landing/src/marks.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var SketchStroke = ({ variant }) => /* @__PURE__ */ jsx(
  "svg",
  {
    class: `nat-handmark nat-handmark--stroke${variant ? ` nat-handmark--${variant}` : ""}`,
    "aria-hidden": "true",
    focusable: "false",
    viewBox: "0 0 120 8",
    preserveAspectRatio: "none",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M1 5 C 15 3, 30 6.5, 45 4 S 75 2.5, 92 5 S 112 4, 119 3.5",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.4",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }
    )
  }
);

// components-local/research/src/hub.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "preact/jsx-runtime";
var ResearchHub = ({ description }) => /* @__PURE__ */ jsxs2("div", { class: "nat-research nat-research-hub", children: [
  /* @__PURE__ */ jsxs2("header", { class: "nat-album__head", children: [
    /* @__PURE__ */ jsx2("h1", { children: "Research" }),
    /* @__PURE__ */ jsx2(SketchStroke, { variant: "name" }),
    description ? /* @__PURE__ */ jsx2("p", { class: "nat-album__lede voice", children: description }) : null
  ] }),
  /* @__PURE__ */ jsx2("div", { class: "nat-album", children: projects.map((p) => /* @__PURE__ */ jsxs2("figure", { class: "nat-plate nat-album__plate", children: [
    /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--tl", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--tr", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--bl", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--br", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs2("figcaption", { class: "nat-album__caption", children: [
      /* @__PURE__ */ jsx2("h2", { class: "nat-album__q voice", children: p.q }),
      /* @__PURE__ */ jsxs2("p", { class: "nat-album__namerow", children: [
        /* @__PURE__ */ jsx2("a", { class: "nat-album__name", href: `/research/${p.slug}/`, children: p.name }),
        /* @__PURE__ */ jsx2("span", { class: "nat-badge nat-mono", children: p.status })
      ] }),
      /* @__PURE__ */ jsx2("p", { class: "nat-album__venue", children: p.venue }),
      /* @__PURE__ */ jsx2("p", { class: "nat-album__blurb", children: p.blurb })
    ] })
  ] }, p.slug)) }),
  /* @__PURE__ */ jsxs2("section", { class: "nat-album__also", children: [
    /* @__PURE__ */ jsx2("h2", { class: "nat-album__also-title nat-mono", children: "Also" }),
    /* @__PURE__ */ jsx2("ul", { class: "nat-also", children: also.map((a) => {
      const external = /^https?:\/\//.test(a.href);
      return /* @__PURE__ */ jsxs2("li", { children: [
        /* @__PURE__ */ jsx2("a", { href: a.href, ...external ? { target: "_blank", rel: "noopener" } : {}, children: a.label }),
        external ? " \u2197" : "",
        " ",
        /* @__PURE__ */ jsx2("span", { class: "nat-mono", children: a.meta })
      ] }, a.href);
    }) })
  ] })
] });

// components-local/research/src/figures.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "preact/jsx-runtime";
var Corners = () => /* @__PURE__ */ jsxs3(Fragment, { children: [
  /* @__PURE__ */ jsx3("span", { class: "nat-plate__corner nat-plate__corner--tl", "aria-hidden": "true" }),
  /* @__PURE__ */ jsx3("span", { class: "nat-plate__corner nat-plate__corner--tr", "aria-hidden": "true" }),
  /* @__PURE__ */ jsx3("span", { class: "nat-plate__corner nat-plate__corner--bl", "aria-hidden": "true" }),
  /* @__PURE__ */ jsx3("span", { class: "nat-plate__corner nat-plate__corner--br", "aria-hidden": "true" })
] });
var RASTER = { x0: 26, x1: 302, span: 96 };
var rasterX = (t) => RASTER.x0 + t / RASTER.span * (RASTER.x1 - RASTER.x0);
var NerRasterFigure = () => {
  const rows = nerRasterSeed.rhythms.map((r, i) => {
    const ticks = [];
    for (let k = 1; k <= nerRasterSeed.tcap && k * r <= RASTER.span; k++) {
      const wobble = (i * 7 + k * 13) % 3 - 1;
      ticks.push({
        x: rasterX(k * r),
        h: 10 + (k % 2 === 0 ? 4 : 0) + wobble,
        spike: k % 4 === 0
      });
    }
    return { r, y: 26 + i * 22, ticks };
  });
  return /* @__PURE__ */ jsxs3("figure", { class: "nat-plate nat-figplate", children: [
    /* @__PURE__ */ jsx3(Corners, {}),
    /* @__PURE__ */ jsx3(
      "svg",
      {
        class: "nat-fig",
        viewBox: "0 0 320 152",
        role: "img",
        "aria-label": "Raster of six oscillator rhythms with beat ticks and gold spike heads",
        children: rows.map(({ r, y, ticks }) => /* @__PURE__ */ jsxs3("g", { children: [
          /* @__PURE__ */ jsx3("line", { class: "nat-fig__rule", x1: RASTER.x0, y1: y, x2: RASTER.x1, y2: y }),
          /* @__PURE__ */ jsx3("text", { class: "nat-fig__label", x: 6, y: y + 3, children: String(r).padStart(2, "0") }),
          ticks.map((t, k) => /* @__PURE__ */ jsxs3("g", { children: [
            /* @__PURE__ */ jsx3("line", { class: "nat-fig__ink", x1: t.x, y1: y, x2: t.x, y2: y - t.h }),
            t.spike && /* @__PURE__ */ jsx3("circle", { class: "nat-fig__wash", cx: t.x, cy: y - t.h - 3, r: 2.2 })
          ] }, k))
        ] }, r))
      }
    ),
    /* @__PURE__ */ jsx3("figcaption", { class: "nat-fig__cap nat-mono", children: `FIG. 01 \xB7 beat raster \xB7 rhythms ${nerRasterSeed.rhythms.join("/")} \xB7 t-cap ${nerRasterSeed.tcap}` })
  ] });
};
var PhdAttractorFigure = () => /* @__PURE__ */ jsxs3("figure", { class: "nat-plate nat-figplate", children: [
  /* @__PURE__ */ jsx3(Corners, {}),
  /* @__PURE__ */ jsxs3(
    "svg",
    {
      class: "nat-fig",
      viewBox: "0 0 240 168",
      role: "img",
      "aria-label": "Nested attractor arcs with a verdigris trajectory settling toward a fixed point",
      children: [
        /* @__PURE__ */ jsx3(
          "path",
          {
            class: "nat-fig__ink",
            d: "M112 148 C 58 146 26 112 30 78 C 34 40 74 16 116 20 C 160 24 202 46 198 84 C 194 122 166 150 112 148 Z"
          }
        ),
        /* @__PURE__ */ jsx3(
          "path",
          {
            class: "nat-fig__ink",
            d: "M108 130 C 66 128 44 102 47 74 C 50 46 80 30 108 33 C 138 36 166 52 163 78 C 160 104 144 128 108 130 Z"
          }
        ),
        /* @__PURE__ */ jsx3(
          "path",
          {
            class: "nat-fig__ink",
            d: "M106 112 C 78 110 62 94 64 74 C 66 54 84 44 104 46 C 124 48 140 60 138 76 C 136 92 126 110 106 112 Z"
          }
        ),
        /* @__PURE__ */ jsx3(
          "path",
          {
            class: "nat-fig__ink",
            d: "M104 96 C 88 95 78 86 79 74 C 80 62 90 56 102 57 C 114 58 124 66 123 76 C 122 86 116 95 104 96 Z"
          }
        ),
        /* @__PURE__ */ jsx3(
          "path",
          {
            class: "nat-fig__verdigris",
            d: "M6 158 C 30 150 54 136 74 116 C 92 98 104 84 110 64 C 113 76 107 90 97 98 C 101 104 107 107 112 104 C 116 101 117 94 114 88"
          }
        ),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: 74, cy: 116, r: 1.6 }),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: 110, cy: 64, r: 1.6 }),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: 97, cy: 98, r: 1.6 }),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__wash", cx: 112, cy: 80, r: 3.2 }),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: 112, cy: 80, r: 1.2 })
      ]
    }
  ),
  /* @__PURE__ */ jsx3("figcaption", { class: "nat-fig__cap nat-mono", children: "FIG. 01 \xB7 attractor arcs \xB7 trajectory to fixed point" })
] });
var LAT = { cols: 7, rows: 5, x0: 24, dx: 32, y0: 26, dy: 26 };
var latX = (i) => LAT.x0 + i * LAT.dx;
var latY = (j) => LAT.y0 + j * LAT.dy;
var MscLatticeFigure = () => /* @__PURE__ */ jsxs3("figure", { class: "nat-plate nat-figplate", children: [
  /* @__PURE__ */ jsx3(Corners, {}),
  /* @__PURE__ */ jsxs3(
    "svg",
    {
      class: "nat-fig",
      viewBox: "0 0 240 160",
      role: "img",
      "aria-label": "Ising lattice of nodes and edges with the selected topology in terracotta",
      children: [
        Array.from(
          { length: LAT.rows },
          (_, j) => Array.from({ length: LAT.cols - 1 }, (_2, i) => /* @__PURE__ */ jsx3(
            "line",
            {
              class: j === 2 && i >= 1 && i <= 3 ? "nat-fig__terracotta" : "nat-fig__ink",
              x1: latX(i),
              y1: latY(j),
              x2: latX(i + 1),
              y2: latY(j)
            },
            `h-${j}-${i}`
          ))
        ),
        Array.from(
          { length: LAT.rows - 1 },
          (_, j) => Array.from({ length: LAT.cols }, (_2, i) => /* @__PURE__ */ jsx3(
            "line",
            {
              class: i === 3 && j >= 1 && j <= 2 ? "nat-fig__terracotta" : "nat-fig__ink",
              x1: latX(i),
              y1: latY(j),
              x2: latX(i),
              y2: latY(j + 1)
            },
            `v-${j}-${i}`
          ))
        ),
        Array.from(
          { length: LAT.rows },
          (_, j) => Array.from({ length: LAT.cols }, (_2, i) => /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: latX(i), cy: latY(j), r: 2.1 }, `n-${j}-${i}`))
        ),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__wash", cx: latX(3), cy: latY(2), r: 2.6 }),
        /* @__PURE__ */ jsx3("circle", { class: "nat-fig__dot", cx: latX(3), cy: latY(2), r: 1.4 })
      ]
    }
  ),
  /* @__PURE__ */ jsx3("figcaption", { class: "nat-fig__cap nat-mono", children: "FIG. 01 \xB7 Ising lattice \xB7 selected topology" })
] });
var figureForSlug = (slug) => {
  switch (slug) {
    case "ner-2025":
      return /* @__PURE__ */ jsx3(NerRasterFigure, {});
    case "phd-overview":
      return /* @__PURE__ */ jsx3(PhdAttractorFigure, {});
    case "masters-thesis":
      return /* @__PURE__ */ jsx3(MscLatticeFigure, {});
    default:
      return null;
  }
};

// components-local/research/src/project.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "preact/jsx-runtime";
var ResearchProject = ({ project: p }) => /* @__PURE__ */ jsxs4("div", { class: "nat-research nat-research-project", children: [
  /* @__PURE__ */ jsx4("header", { class: "nat-cover", children: /* @__PURE__ */ jsxs4("div", { class: "nat-cover__slab", children: [
    /* @__PURE__ */ jsx4("span", { class: "nat-plate__corner nat-plate__corner--tl", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx4("span", { class: "nat-plate__corner nat-plate__corner--br", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx4("h1", { class: "nat-cover__name", children: p.name }),
    /* @__PURE__ */ jsxs4("p", { class: "nat-cover__badgerow", children: [
      /* @__PURE__ */ jsx4("span", { class: "nat-badge nat-mono", children: p.status }),
      /* @__PURE__ */ jsx4("span", { class: "nat-cover__venue", children: p.venue })
    ] }),
    /* @__PURE__ */ jsx4("p", { class: "nat-cover__q voice", children: p.q }),
    /* @__PURE__ */ jsx4(SketchStroke, { variant: "name" })
  ] }) }),
  /* @__PURE__ */ jsxs4("section", { class: "nat-outputs", "aria-label": "Outputs", children: [
    /* @__PURE__ */ jsx4("h2", { class: "nat-outputs__label nat-mono", children: "Outputs" }),
    /* @__PURE__ */ jsx4("ul", { class: "nat-outputs__row", children: p.outputs.map((o) => {
      const external = /^https?:\/\//.test(o.href);
      return /* @__PURE__ */ jsxs4("li", { children: [
        /* @__PURE__ */ jsx4(
          "a",
          {
            class: "nat-outputs__link",
            href: o.href,
            ...external ? { target: "_blank", rel: "noopener" } : {},
            children: o.label
          }
        ),
        external ? /* @__PURE__ */ jsx4("span", { class: "nat-outputs__ext", "aria-hidden": "true", children: " \u2197" }) : null
      ] }, o.href);
    }) })
  ] }),
  figureForSlug(p.slug)
] });

// components-local/research/src/Research.tsx
import { jsx as jsx5 } from "preact/jsx-runtime";
var normalizeSlug = (slug) => slug.replace(/\/index$/, "");
var isResearchSlug = (slug) => slug === "research/index" || slug.startsWith("research/");
var Research = ({ fileData }) => {
  const raw = fileData.slug ?? "";
  if (!isResearchSlug(raw)) return null;
  const slug = normalizeSlug(raw);
  if (slug === "research") {
    return /* @__PURE__ */ jsx5(ResearchHub, { description: fileData.frontmatter?.description });
  }
  const project = projects.find((p) => slug === `research/${p.slug}`);
  if (!project) return null;
  return /* @__PURE__ */ jsx5(ResearchProject, { project });
};
Research.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if ((p === "/research" || p.startsWith("/research/")) && !document.documentElement.hasAttribute("data-page")) {
    document.documentElement.setAttribute("data-page", "research");
  }
`;
var Research_default = (() => Research);

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
  Research_default as Research,
  isResearchSlug2 as isResearchSlug
};
