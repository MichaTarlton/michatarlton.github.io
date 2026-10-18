// quartz/plugins/loader/conditions.ts
var globals = globalThis;
function sharedRegistry() {
  return globals.__quartzCustomConditions ??= /* @__PURE__ */ new Map();
}
function registerCondition(name, predicate) {
  sharedRegistry().set(name, predicate);
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

// components-local/landing/src/Landing.tsx
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
var CV_HREF = "/attachments/tarlton-cv.pdf";
var contacts = [
  { label: "Email", href: "mailto:M@Tarlton.info" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/m-tarlton/" },
  { label: "GitHub", href: "https://github.com/MichaTarlton" }
];
var Landing = ({ fileData }) => {
  const hero = fileData.frontmatter?.hero ?? {};
  return /* @__PURE__ */ jsxs("div", { class: "gr-landing", children: [
    /* @__PURE__ */ jsx("section", { class: "gr-band gr-band--masthead", "aria-label": "About", children: /* @__PURE__ */ jsxs("div", { class: "gr-masthead", children: [
      /* @__PURE__ */ jsxs("div", { class: "gr-masthead__text", children: [
        /* @__PURE__ */ jsx("h1", { class: "gr-masthead__name display", children: hero.name }),
        /* @__PURE__ */ jsx("p", { class: "gr-masthead__identity voice", children: hero.identity }),
        hero.status && /* @__PURE__ */ jsx("p", { class: "gr-masthead__status annotation", children: hero.status }),
        /* @__PURE__ */ jsxs("div", { class: "gr-masthead__ctas", children: [
          hero.primaryCta?.href && /* @__PURE__ */ jsx(
            "a",
            {
              class: "gr-btn",
              href: hero.primaryCta.href,
              target: "_blank",
              rel: "noreferrer noopener",
              children: hero.primaryCta.label ?? "Faculty page"
            }
          ),
          /* @__PURE__ */ jsx("a", { class: "gr-btn", href: CV_HREF, download: true, children: "Download CV" })
        ] })
      ] }),
      hero.photo && /* @__PURE__ */ jsx("figure", { class: "gr-masthead__plate", children: /* @__PURE__ */ jsx("img", { src: hero.photo, alt: hero.photoAlt ?? "", width: "220", height: "220" }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { class: "gr-band gr-band--sim", "aria-label": "Hero figure", children: /* @__PURE__ */ jsxs(
      "div",
      {
        class: "gr-sim",
        id: "gr-sim-mount",
        "data-sim": "sbf-oscillator-bank",
        "data-sim-oscillators": "6",
        "data-sim-fps": "30",
        children: [
          /* @__PURE__ */ jsx("canvas", { class: "gr-sim__canvas", width: "1200", height: "480", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { class: "gr-sim__annot gr-sim__annot--tl", children: "FIG. 01" }),
          /* @__PURE__ */ jsx("span", { class: "gr-sim__annot gr-sim__annot--tr", children: "OSC 6" }),
          /* @__PURE__ */ jsx("span", { class: "gr-sim__annot gr-sim__annot--br", children: "30 FPS" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("section", { class: "gr-band gr-band--research", "aria-label": "Research index", children: [
      /* @__PURE__ */ jsx("h2", { class: "gr-band__head h2", children: "Research" }),
      projects.map((p, i) => /* @__PURE__ */ jsxs("a", { class: "gr-rrow", href: `/research/${p.slug}/`, children: [
        /* @__PURE__ */ jsx("span", { class: "gr-rrow__numeral display", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsxs("span", { class: "gr-rrow__body", children: [
          /* @__PURE__ */ jsx("span", { class: "gr-rrow__q voice", children: p.q }),
          /* @__PURE__ */ jsxs("span", { class: "gr-rrow__meta annotation", children: [
            p.name,
            " \xB7 ",
            p.status
          ] }),
          /* @__PURE__ */ jsx("span", { class: "gr-rrow__venue annotation", children: p.venue })
        ] })
      ] })),
      /* @__PURE__ */ jsx("ul", { class: "gr-also", children: also.map((a) => /* @__PURE__ */ jsxs("li", { class: "annotation", children: [
        /* @__PURE__ */ jsx("a", { href: a.href, children: a.label }),
        " \xB7 ",
        a.meta
      ] })) })
    ] }),
    /* @__PURE__ */ jsx("section", { class: "gr-band gr-band--door", "aria-label": "Cortex", children: /* @__PURE__ */ jsxs("a", { class: "gr-door", href: "/wiki/", children: [
      /* @__PURE__ */ jsx("span", { class: "gr-door__marker", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("span", { class: "gr-door__label display", children: "Cortex" }),
      /* @__PURE__ */ jsx("span", { class: "gr-door__coord", children: "\u2192 /wiki/" }),
      /* @__PURE__ */ jsx(
        "svg",
        {
          class: "gr-door__chevron",
          viewBox: "0 0 24 24",
          width: "28",
          height: "28",
          fill: "none",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M8 4 L16 12 L8 20",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "square"
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("section", { class: "gr-band gr-band--contact", "aria-label": "Contact", children: [
      /* @__PURE__ */ jsx("h2", { class: "gr-band__head h2", children: "Contact" }),
      /* @__PURE__ */ jsx("p", { class: "gr-contact__email", children: /* @__PURE__ */ jsx("a", { href: contacts[0].href, children: contacts[0].label === "Email" ? "M@Tarlton.info" : contacts[0].label }) }),
      /* @__PURE__ */ jsx("p", { class: "gr-contact__links", children: contacts.slice(1).map((c, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
        i > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \xB7 " }),
        /* @__PURE__ */ jsx("a", { href: c.href, target: "_blank", rel: "noreferrer noopener", children: c.label })
      ] })) })
    ] })
  ] });
};
Landing.beforeDOMLoaded = `(function () {
  if (!document.documentElement.hasAttribute("data-page")) {
    document.documentElement.setAttribute("data-page", "index");
  }
})();`;
Landing.afterDOMLoaded = `(function () {
  function inject() {
    if (document.querySelector("script[data-gr-sim]")) return;
    var s = document.createElement("script");
    s.type = "module";
    s.src = "/static/js/gr-sim.js";
    s.setAttribute("data-gr-sim", "");
    s.setAttribute("data-persist", "");
    document.head.appendChild(s);
  }
  if (document.getElementById("gr-sim-mount")) inject();
  // The loader runs once per full page load (module cache); re-check on SPA
  // nav so index reached from another page still boots the bundle.
  document.addEventListener("nav", function () {
    if (document.getElementById("gr-sim-mount")) inject();
  });
})();`;
var Landing_default = (() => Landing);

// components-local/landing/src/index.ts
registerCondition("is-index", (props) => props.fileData.slug === "index");
export {
  Landing_default as Landing
};
