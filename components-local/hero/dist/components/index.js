// components-local/hero/src/landingScript.ts
var landingScript_default = `(function () {
  var VARIANTS = ["a", "b", "c"];
  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = 0;

  function current() {
    var v = html.getAttribute("data-variant") || "a";
    return VARIANTS.indexOf(v) >= 0 ? v : "a";
  }

  function label() {
    var v = current();
    var el = document.querySelector(".landing.variant-" + v);
    var name = el ? el.getAttribute("data-variant-name") : "";
    var lab = document.querySelector(".proto-label");
    if (lab) lab.textContent = v.toUpperCase() + (name ? " \xB7 " + name : "");
  }

  function setVariant(v) {
    html.setAttribute("data-variant", v);
    var u = new URL(location.href);
    u.searchParams.set("variant", v);
    history.replaceState(null, "", u.toString());
    label();
    startField();
  }

  function cycle(dir) {
    var i = VARIANTS.indexOf(current());
    setVariant(VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length]);
  }

  var bar = document.querySelector(".proto-bar");
  if (bar) {
    bar.querySelector(".proto-prev").addEventListener("click", function () { cycle(-1); });
    bar.querySelector(".proto-next").addEventListener("click", function () { cycle(1); });
    bar.querySelector(".proto-theme").addEventListener("click", function (e) {
      e.preventDefault();
      var dark = html.getAttribute("saved-theme") === "dark";
      var u = new URL(location.href);
      if (dark) { u.searchParams.delete("dark"); } else { u.searchParams.set("dark", "1"); }
      localStorage.setItem("theme", dark ? "light" : "dark");
      location.href = u.toString();
    });
    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    });
  }
  label();

  // \u2500\u2500 Ambient vector field \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function startField() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var v = current();
    var canvas = document.querySelector(".landing.variant-" + v + " canvas.field-canvas");
    if (!canvas || reduced) return;
    var mode = canvas.getAttribute("data-field"); // hero | page
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, particles = [];
    var N = mode === "page" ? 420 : 260;
    var ink = "#3a4a8f", mark = "#a8690e";

    function readColors() {
      var cs = getComputedStyle(html);
      var a = cs.getPropertyValue("--secondary").trim();
      var b = cs.getPropertyValue("--accent-mark").trim();
      if (a) ink = a; if (b) mark = b;
    }
    function resize() {
      var host = mode === "page" ? { clientWidth: window.innerWidth, clientHeight: window.innerHeight } : canvas.parentElement;
      W = Math.max(1, host.clientWidth); H = Math.max(1, host.clientHeight);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
    }
    function field(x, y, t) {
      var sx = x * 0.006, sy = y * 0.006;
      var dx = Math.cos(sy * 1.6 + t * 0.15) + Math.sin(sx * 1.9 + sy * 0.6);
      var dy = Math.sin(sx * 1.4 - t * 0.12) - Math.cos(sy * 2.1 + sx * 0.7);
      var l = Math.hypot(dx, dy) + 1e-6;
      return [dx / l, dy / l];
    }
    function spawn(p) {
      p.x = Math.random() * W; p.y = Math.random() * H;
      p.px = p.x; p.py = p.y; p.age = 0; p.life = 4 + Math.random() * 6;
      p.speed = 18 + Math.random() * 26; p.mark = Math.random() < 0.18;
    }
    function init() { particles = []; for (var i = 0; i < N; i++) { var p = {}; spawn(p); p.age = Math.random() * p.life; particles.push(p); } }

    var last = 0, T = 0, onscreen = true;
    function frame(t) {
      if (!document.body.contains(canvas)) return;
      var dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t; T += dt;
      if (onscreen && document.visibilityState === "visible") {
        // fade previous frame toward transparent \u2192 soft trails
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0," + (mode === "page" ? 0.06 : 0.09) + ")";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        for (var i = 0; i < N; i++) {
          var p = particles[i];
          var f = field(p.x - W / 2, p.y - H / 2, T);
          p.px = p.x; p.py = p.y;
          p.x += f[0] * p.speed * dt; p.y += f[1] * p.speed * dt; p.age += dt;
          var k = Math.sin(Math.PI * Math.min(1, p.age / p.life));
          ctx.globalAlpha = (mode === "page" ? 0.22 : 0.55) * k;
          ctx.strokeStyle = p.mark ? mark : ink;
          ctx.lineWidth = p.mark ? 1.6 : 1.1;
          ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
          if (p.age > p.life || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) spawn(p);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { onscreen = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener("themechange", readColors);
    window.addEventListener("resize", function () { resize(); init(); });
    readColors(); resize(); init();
    raf = requestAnimationFrame(frame);
  }
  startField();
})();`;

// components-local/hero/src/Hero.tsx
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
var research = [
  {
    n: "01",
    href: "/research/ner-2025/",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata \xB7 IEEE NER 2025",
    blurb: "A reinforcement-learning architecture transposed from the striatal beat-frequency model: online periodicity learning encoded directly in synaptic weights, built for neuromorphic edge hardware.",
    status: "Published",
    fig: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", children: [
      /* @__PURE__ */ jsx("line", { x1: "10", y1: "70", x2: "190", y2: "70", opacity: "0.35" }),
      /* @__PURE__ */ jsx("line", { x1: "24", y1: "70", x2: "24", y2: "34" }),
      /* @__PURE__ */ jsx("line", { x1: "48", y1: "70", x2: "48", y2: "52" }),
      /* @__PURE__ */ jsx("line", { x1: "72", y1: "70", x2: "72", y2: "18" }),
      /* @__PURE__ */ jsx("line", { x1: "96", y1: "70", x2: "96", y2: "44" }),
      /* @__PURE__ */ jsx("line", { x1: "120", y1: "70", x2: "120", y2: "58" }),
      /* @__PURE__ */ jsx("line", { x1: "144", y1: "70", x2: "144", y2: "26" }),
      /* @__PURE__ */ jsx("line", { x1: "168", y1: "70", x2: "168", y2: "52" }),
      /* @__PURE__ */ jsx("circle", { cx: "72", cy: "12", r: "4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ jsx("circle", { cx: "144", cy: "20", r: "4", fill: "currentColor", stroke: "none", opacity: "0.55" })
    ] })
  },
  {
    n: "02",
    href: "/research/phd-overview/",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD Research \xB7 OsloMet",
    blurb: "Designing learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics \u2014 for online, always-on, low-energy learning.",
    status: "In progress",
    fig: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", children: [
      /* @__PURE__ */ jsx("path", { d: "M0 34 Q 25 8 50 34 T 100 34 T 150 34 T 200 34" }),
      /* @__PURE__ */ jsx("path", { d: "M0 46 Q 25 26 50 46 T 100 46 T 150 46 T 200 46", opacity: "0.6" }),
      /* @__PURE__ */ jsx("path", { d: "M0 58 Q 25 44 50 58 T 100 58 T 150 58 T 200 58", opacity: "0.35" })
    ] })
  },
  {
    n: "03",
    href: "/research/masters-thesis/",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc Thesis \xB7 Kavli Institute, NTNU",
    blurb: "An information-based Bayesian criterion for inferring Ising-model networks from neural spiking activity \u2014 designed, simulated, and evaluated on HPC clusters.",
    status: "Thesis",
    fig: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 80", fill: "currentColor", children: [
      /* @__PURE__ */ jsx("path", { d: "M28 18 l6 10 h-12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M58 30 l-6 -10 h12 z", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M88 18 l6 10 h-12 z", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M118 30 l-6 -10 h12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M148 18 l6 10 h-12 z", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M178 30 l-6 -10 h12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M28 48 l-6 10 h12 z", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M58 40 l6 10 h-12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M88 48 l-6 10 h12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M118 40 l6 10 h-12 z", opacity: "0.4" }),
      /* @__PURE__ */ jsx("path", { d: "M148 48 l-6 10 h12 z" }),
      /* @__PURE__ */ jsx("path", { d: "M178 40 l6 10 h-12 z", opacity: "0.4" })
    ] })
  }
];
var recent = [
  { t: "Striatal beat-frequency model", d: "Sep 12", m: "sapling" },
  { t: "Ising-model network inference", d: "Sep 9", m: "tree" },
  { t: "Neuromorphic edge hardware", d: "Sep 3", m: "seedling" },
  { t: "Spike-timing-dependent plasticity", d: "Aug 28", m: "sapling" }
];
var Photo = ({ size }) => /* @__PURE__ */ jsx("div", { class: `photo photo-${size}`, "aria-label": "Photo placeholder", children: /* @__PURE__ */ jsx("span", { children: "MT" }) });
var Ctas = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "ctas", children: [
  hero.primaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-primary", href: hero.primaryCta.href, children: hero.primaryCta.label }),
  hero.secondaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-secondary", href: hero.secondaryCta.href, children: hero.secondaryCta.label }),
  /* @__PURE__ */ jsx("a", { class: "cta cta-ghost", href: "/cv/", children: "CV" })
] });
var Status = ({ text }) => text ? /* @__PURE__ */ jsxs("p", { class: "status", children: [
  /* @__PURE__ */ jsx("span", { class: "status-dot", "aria-hidden": "true" }),
  text
] }) : null;
var Contact = () => /* @__PURE__ */ jsxs("section", { class: "contact", children: [
  /* @__PURE__ */ jsx("p", { class: "kicker", children: "Contact" }),
  /* @__PURE__ */ jsxs("p", { class: "contact-copy", children: [
    "I'm looking for research positions in neuro-AI, neuromorphic computing and brain-inspired learning. ",
    /* @__PURE__ */ jsx("a", { href: "mailto:M@Tarlton.info", children: "Email me" }),
    ", or find me on",
    " ",
    /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/m-tarlton/", children: "LinkedIn" }),
    " and",
    " ",
    /* @__PURE__ */ jsx("a", { href: "https://github.com/MichaTarlton", children: "GitHub" }),
    "."
  ] })
] });
var VariantA = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "landing variant-a", "data-variant-name": "Studio \xB7 field behind the type", children: [
  /* @__PURE__ */ jsxs("section", { class: "a-hero", children: [
    /* @__PURE__ */ jsxs("div", { class: "a-field", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { class: "grid-paper" }),
      /* @__PURE__ */ jsx("canvas", { class: "field-canvas", "data-field": "hero" })
    ] }),
    /* @__PURE__ */ jsxs("div", { class: "a-hero-inner", children: [
      /* @__PURE__ */ jsx(Photo, { size: "lg" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "NeuroAI researcher \xB7 Oslo" }),
        /* @__PURE__ */ jsx("h1", { class: "display", children: hero.name }),
        /* @__PURE__ */ jsx("p", { class: "lede", children: hero.identity }),
        /* @__PURE__ */ jsx(Status, { text: hero.status ?? "" }),
        /* @__PURE__ */ jsx(Ctas, { hero })
      ] })
    ] })
  ] }),
  hero.thinking && /* @__PURE__ */ jsxs("section", { class: "a-thinking", children: [
    /* @__PURE__ */ jsx("span", { class: "kicker accent", children: "Currently thinking about" }),
    /* @__PURE__ */ jsx("p", { class: "thinking-copy", children: hero.thinking })
  ] }),
  /* @__PURE__ */ jsxs("section", { class: "a-research", children: [
    /* @__PURE__ */ jsxs("div", { class: "section-head", children: [
      /* @__PURE__ */ jsx("h2", { children: "Featured research" }),
      /* @__PURE__ */ jsx("a", { class: "more", href: "/research/", children: "All research \u2192" })
    ] }),
    /* @__PURE__ */ jsx("div", { class: "a-cards", children: research.map((r) => /* @__PURE__ */ jsxs("a", { class: "a-card", href: r.href, children: [
      /* @__PURE__ */ jsx("div", { class: "a-card-fig", children: r.fig }),
      /* @__PURE__ */ jsx("p", { class: "q", children: r.q }),
      /* @__PURE__ */ jsx("p", { class: "meta", children: r.meta })
    ] })) })
  ] }),
  /* @__PURE__ */ jsxs("section", { class: "a-recent", children: [
    /* @__PURE__ */ jsxs("div", { class: "section-head", children: [
      /* @__PURE__ */ jsx("h2", { children: "Recently in the Cortex" }),
      /* @__PURE__ */ jsx("a", { class: "more", href: "/wiki/", children: "Enter the Cortex \u2192" })
    ] }),
    /* @__PURE__ */ jsx("ul", { class: "recent-list", children: recent.map((n) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx("span", { class: `maturity m-${n.m}`, title: n.m }),
      /* @__PURE__ */ jsx("a", { href: "/wiki/", children: n.t }),
      /* @__PURE__ */ jsx("span", { class: "date", children: n.d })
    ] })) })
  ] }),
  /* @__PURE__ */ jsx(Contact, {})
] });
var VariantB = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "landing variant-b", "data-variant-name": "Letter \xB7 editorial column, no canvas", children: [
  /* @__PURE__ */ jsxs("section", { class: "b-hero", children: [
    /* @__PURE__ */ jsxs("div", { class: "b-byline", children: [
      /* @__PURE__ */ jsx(Photo, { size: "sm" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "NeuroAI researcher \xB7 Oslo" }),
        /* @__PURE__ */ jsx("h1", { class: "display", children: hero.name })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { class: "b-letter drop-cap", children: hero.identity }),
    hero.thinking && /* @__PURE__ */ jsxs("p", { class: "b-thinking", children: [
      /* @__PURE__ */ jsx("em", { children: "Currently thinking about" }),
      " ",
      hero.thinking,
      "."
    ] }),
    /* @__PURE__ */ jsx(Status, { text: hero.status ?? "" }),
    /* @__PURE__ */ jsx(Ctas, { hero })
  ] }),
  /* @__PURE__ */ jsxs("section", { class: "b-research", children: [
    /* @__PURE__ */ jsx("h2", { children: "Three questions I'm working on" }),
    /* @__PURE__ */ jsx("ol", { class: "b-rows", children: research.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { class: "b-row", href: r.href, children: [
      /* @__PURE__ */ jsx("span", { class: "b-num", children: r.n }),
      /* @__PURE__ */ jsxs("div", { class: "b-row-body", children: [
        /* @__PURE__ */ jsx("p", { class: "q", children: r.q }),
        /* @__PURE__ */ jsx("p", { class: "blurb", children: r.blurb }),
        /* @__PURE__ */ jsxs("p", { class: "meta", children: [
          r.meta,
          " ",
          /* @__PURE__ */ jsx("span", { class: "pill", children: r.status })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { class: "b-row-fig", children: r.fig })
    ] }) })) })
  ] }),
  /* @__PURE__ */ jsxs("section", { class: "b-recent", children: [
    /* @__PURE__ */ jsx("h2", { children: "Recently in the Cortex" }),
    /* @__PURE__ */ jsxs("p", { class: "b-recent-copy", children: [
      "A working garden of notes behind a ",
      /* @__PURE__ */ jsx("a", { href: "/wiki/", children: "marked door" }),
      ". Latest:",
      " ",
      recent.map((n, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/wiki/", children: n.t }),
        i < recent.length - 1 ? ", " : "."
      ] }))
    ] })
  ] }),
  /* @__PURE__ */ jsx(Contact, {})
] });
var VariantC = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "landing variant-c", "data-variant-name": "Notebook \xB7 sticky rail, page-wide field", children: [
  /* @__PURE__ */ jsx("canvas", { class: "field-canvas c-page-field", "data-field": "page", "aria-hidden": "true" }),
  /* @__PURE__ */ jsxs("div", { class: "c-grid", children: [
    /* @__PURE__ */ jsxs("aside", { class: "c-rail", children: [
      /* @__PURE__ */ jsx(Photo, { size: "lg" }),
      /* @__PURE__ */ jsx("p", { class: "kicker accent", children: "NeuroAI researcher" }),
      /* @__PURE__ */ jsx("h1", { class: "display", children: hero.name }),
      /* @__PURE__ */ jsx("p", { class: "c-oneliner", children: "Spiking networks, neuro-dynamics, and time in the brain \u2014 groundwork for the next generation of machine intelligence." }),
      /* @__PURE__ */ jsx(Status, { text: hero.status ?? "" }),
      /* @__PURE__ */ jsx(Ctas, { hero }),
      /* @__PURE__ */ jsxs("dl", { class: "c-facts", children: [
        /* @__PURE__ */ jsx("dt", { children: "Based" }),
        /* @__PURE__ */ jsx("dd", { children: "Oslo, Norway" }),
        /* @__PURE__ */ jsx("dt", { children: "Affiliation" }),
        /* @__PURE__ */ jsx("dd", { children: "OsloMet" }),
        /* @__PURE__ */ jsx("dt", { children: "Email" }),
        /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("a", { href: "mailto:M@Tarlton.info", children: "M@Tarlton.info" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { class: "c-main", children: [
      /* @__PURE__ */ jsxs("section", { class: "c-intro", children: [
        /* @__PURE__ */ jsx("p", { class: "lede", children: hero.identity }),
        hero.thinking && /* @__PURE__ */ jsxs("p", { class: "c-thinking", children: [
          /* @__PURE__ */ jsx("span", { class: "kicker accent", children: "Currently thinking about" }),
          /* @__PURE__ */ jsx("span", { class: "thinking-copy", children: hero.thinking })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { class: "c-research", children: [
        /* @__PURE__ */ jsxs("div", { class: "section-head", children: [
          /* @__PURE__ */ jsx("h2", { children: "Featured research" }),
          /* @__PURE__ */ jsx("a", { class: "more", href: "/research/", children: "All \u2192" })
        ] }),
        research.map((r) => /* @__PURE__ */ jsxs("a", { class: "c-row", href: r.href, children: [
          /* @__PURE__ */ jsx("div", { class: "c-row-fig", children: r.fig }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { class: "meta", children: [
              r.n,
              " \xB7 ",
              r.meta
            ] }),
            /* @__PURE__ */ jsx("p", { class: "q", children: r.q }),
            /* @__PURE__ */ jsx("p", { class: "blurb", children: r.blurb })
          ] })
        ] }))
      ] }),
      /* @__PURE__ */ jsxs("section", { class: "c-recent", children: [
        /* @__PURE__ */ jsxs("div", { class: "section-head", children: [
          /* @__PURE__ */ jsx("h2", { children: "Recently in the Cortex" }),
          /* @__PURE__ */ jsx("a", { class: "more", href: "/wiki/", children: "Enter \u2192" })
        ] }),
        /* @__PURE__ */ jsx("ul", { class: "recent-list", children: recent.map((n) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { class: `maturity m-${n.m}`, title: n.m }),
          /* @__PURE__ */ jsx("a", { href: "/wiki/", children: n.t }),
          /* @__PURE__ */ jsx("span", { class: "date", children: n.d })
        ] })) })
      ] }),
      /* @__PURE__ */ jsx(Contact, {})
    ] })
  ] })
] });
var Hero = ({ fileData }) => {
  if (fileData.slug !== "index") return null;
  const hero = fileData.frontmatter?.hero ?? {};
  hero.name ??= "Mike Tarlton";
  hero.identity ??= "Neuro-AI researcher building brain-inspired learning systems.";
  return /* @__PURE__ */ jsxs("div", { class: "landing-proto", children: [
    /* @__PURE__ */ jsx(VariantA, { hero }),
    /* @__PURE__ */ jsx(VariantB, { hero }),
    /* @__PURE__ */ jsx(VariantC, { hero }),
    /* @__PURE__ */ jsxs("div", { class: "proto-bar", role: "toolbar", "aria-label": "Prototype variant switcher", children: [
      /* @__PURE__ */ jsx("button", { class: "proto-prev", "aria-label": "Previous variant", children: "\u2190" }),
      /* @__PURE__ */ jsx("span", { class: "proto-label", children: "\u2026" }),
      /* @__PURE__ */ jsx("button", { class: "proto-next", "aria-label": "Next variant", children: "\u2192" }),
      /* @__PURE__ */ jsx("a", { class: "proto-theme", href: "#", title: "Toggle light/dark", children: "\u25D0" })
    ] })
  ] });
};
Hero.beforeDOMLoaded = `(function(){
  // PROTOTYPE: light is the design; force light on the landing unless ?dark.
  var p=new URLSearchParams(location.search);
  if(location.pathname==="/"||location.pathname==="/index.html"){
    if(!p.has("dark")){localStorage.setItem("theme","light");document.documentElement.setAttribute("saved-theme","light");}
  }
  var v=(p.get("variant")||"a").toLowerCase(); if(!/^[abc]$/.test(v)) v="a";
  document.documentElement.setAttribute("data-variant",v);
})();`;
Hero.afterDOMLoaded = landingScript_default;
var Hero_default = (() => Hero);
export {
  Hero_default as Hero
};
