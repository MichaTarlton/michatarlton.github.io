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

// components-local/landing/src/marks.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var TILE_PATTERN = [
  1,
  1,
  0,
  1,
  2,
  1,
  0,
  1,
  1,
  2,
  1,
  0,
  1,
  1,
  1,
  2,
  1,
  1,
  0,
  1,
  1,
  2,
  1,
  1
];
var MosaicBand = () => /* @__PURE__ */ jsx("div", { class: "nat-mosaic", role: "separator", children: TILE_PATTERN.map((t, i) => /* @__PURE__ */ jsx(
  "span",
  {
    class: "nat-mosaic__tile" + (t === 2 ? " nat-mosaic__tile--deep" : t === 0 ? " nat-mosaic__tile--gap" : "")
  },
  i
)) });
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
var SketchFrame = () => /* @__PURE__ */ jsx(
  "svg",
  {
    class: "nat-handmark nat-handmark--frame",
    "aria-hidden": "true",
    focusable: "false",
    viewBox: "0 0 100 40",
    preserveAspectRatio: "none",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M0.8 1.6 C 25 0.9, 75 1.8, 99.2 1.2 M99.2 1.2 C 99.6 12, 98.7 28, 99.3 38.8 M99.3 38.8 C 70 39.6, 30 38.6, 0.9 39.2 M0.9 39.2 C 0.4 26, 1.3 12, 0.8 1.6",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }
    )
  }
);
var SprigMark = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    class: "nat-handmark nat-handmark--sprig",
    "aria-hidden": "true",
    focusable: "false",
    viewBox: "0 0 48 48",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M24 44 C 23.4 36, 24.4 30, 23.6 24 M23.6 24 C 19 19, 14 17, 9 11 M23.6 24 C 28 18, 32 16, 38 9 M23.6 24 C 23.2 18, 24 12, 23.4 6",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.4",
          "stroke-linecap": "round"
        }
      ),
      /* @__PURE__ */ jsx("circle", { cx: "9", cy: "11", r: "2", class: "nat-handmark__leaf" }),
      /* @__PURE__ */ jsx("circle", { cx: "38", cy: "9", r: "2", class: "nat-handmark__leaf" }),
      /* @__PURE__ */ jsx("circle", { cx: "23.4", cy: "6", r: "2", class: "nat-handmark__leaf" })
    ]
  }
);
var DoorTree = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    class: "nat-handmark nat-door__tree",
    "aria-hidden": "true",
    focusable: "false",
    viewBox: "0 0 240 120",
    children: [
      /* @__PURE__ */ jsxs("g", { class: "nat-door__branches", children: [
        /* @__PURE__ */ jsx("path", { d: "M120 118 C 119 100, 121.5 86, 118 70" }),
        /* @__PURE__ */ jsx("path", { d: "M118 70 C 110 58, 97 52, 84 40" }),
        /* @__PURE__ */ jsx("path", { d: "M118 70 C 128 56, 142 50, 152 36" }),
        /* @__PURE__ */ jsx("path", { d: "M118 70 C 116.4 56, 118.4 44, 116 30" }),
        /* @__PURE__ */ jsx("path", { d: "M84 40 C 76.5 32, 70 26, 66 14" }),
        /* @__PURE__ */ jsx("path", { d: "M84 40 C 87.5 31, 92 23, 96 12" }),
        /* @__PURE__ */ jsx("path", { d: "M152 36 C 158.5 26, 166 20, 174 14" }),
        /* @__PURE__ */ jsx("path", { d: "M152 36 C 146.5 27, 144 18, 142 8" }),
        /* @__PURE__ */ jsx("path", { d: "M116 30 C 111.5 22, 108 16, 104 9" }),
        /* @__PURE__ */ jsx("path", { d: "M116 30 C 121 22, 125 16, 129 8" })
      ] }),
      /* @__PURE__ */ jsxs("g", { class: "nat-door__leaves", children: [
        /* @__PURE__ */ jsx("circle", { cx: "66", cy: "14", r: "2.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "96", cy: "12", r: "2.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "104", cy: "9", r: "2.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "129", cy: "8", r: "2.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "142", cy: "8", r: "2.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "174", cy: "14", r: "2.6" })
      ] })
    ]
  }
);

// components-local/landing/dist/simMount.generated.ts
var simMount_generated_default = '"use strict";(()=>{var E={maxNodes:240,forkChance:.06,stepLen:1.15,wobble:.42},T={maxNodes:140,forkChance:.03,stepLen:.9,wobble:.42},N=33;function V(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function L(e){let t=e+1831565813>>>0,n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),[t,((n^n>>>14)>>>0)/4294967296]}function I(e,t=E){return{nodes:[{id:0,x:0,y:0,angle:-Math.PI/2,parent:null,born:0}],tips:[0],newest:0,maxNodes:t.maxNodes,forkChance:t.forkChance,stepLen:t.stepLen,wobble:t.wobble,tick:0,seed:e,rng:V(e),carry:0}}function F(e,t){let n={...e,carry:e.carry+Math.max(0,t)};for(;n.carry>=N;)n=A(n),n={...n,carry:n.carry-N};return n}function A(e){if(e.nodes.length>=e.maxNodes)return{...e,tick:e.tick+1};let t=e.tips[e.tips.length-1],n=e.nodes[t],o=e.rng,[l,g]=L(o);o=l;let b=n.angle+(g*2-1)*e.wobble,[h,S]=L(o);o=h;let i=e.stepLen*(.8+.4*S),a=e.nodes.length,d={id:a,x:n.x+Math.cos(b)*i,y:n.y+Math.sin(b)*i,angle:b,parent:n.id,born:e.tick+1},u=[...e.nodes,d],s=[...e.tips];s[s.length-1]=a;let[x,f]=L(o);if(o=x,f<e.forkChance&&u.length<e.maxNodes){let[p,r]=L(o);o=p;let c=b+(r<.5?-1:1)*(.5+.45*r),w=u.length;u.push({id:w,x:d.x,y:d.y,angle:c,parent:d.id,born:e.tick+1}),s.push(w)}return{...e,nodes:u,tips:s,newest:a,tick:e.tick+1,rng:o}}var G=120;function O(e,t=E,n=G){let o=I(e,t);for(let l=0;l<n;l++)o=A(o);return o}var z={ink:"--nat-ink",ornamentGold:"--nat-ornament-gold",paper:"--nat-paper",surface:"--nat-surface"};function R(e,t=""){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()||t}function P(e){let t=e.getContext("2d"),n=0,o=0,l=1;function g(){if(!t)return;let i=e.getBoundingClientRect();l=Math.min(window.devicePixelRatio||1,2),n=Math.max(1,Math.floor(i.width)),o=Math.max(1,Math.floor(i.height)),e.width=n*l,e.height=o*l,t.setTransform(l,0,0,l,0,0)}function b(i){let a=1/0,d=1/0,u=-1/0,s=-1/0;for(let m of i.nodes)m.x<a&&(a=m.x),m.y<d&&(d=m.y),m.x>u&&(u=m.x),m.y>s&&(s=m.y);Number.isFinite(a)||(a=d=u=s=0);let x=Math.max(u-a,1),f=Math.max(s-d,1),p=18,r=Math.min((n-p*2)/x,(o-p*2)/f,6),c=(a+u)/2,w=(d+s)/2;return(m,v)=>[n/2+(m-c)*r,o/2+(v-w)*r]}function h(i,a){if(!t)return;t.clearRect(0,0,n,o);let d=R(z.ink),u=R(z.ornamentGold),s=b(i),x=i.tick,f=(r,c)=>Math.sin(r*12.9898+c*78.233)*1.4;t.lineWidth=1,t.strokeStyle=d,t.lineCap="round",t.lineJoin="round";for(let r of i.nodes){if(r.parent===null)continue;let c=i.nodes[r.parent],w=s(c.x,c.y),m=s(r.x,r.y),v=x-r.born,C=v<=6?(1-v/7)*3:0,_=a.x*C,k=a.y*C;t.beginPath(),t.moveTo(w[0]+f(c.id,0),w[1]+f(c.id,1)),t.lineTo(m[0]+f(r.id,0)+_,m[1]+f(r.id,1)+k),t.stroke()}let p=i.nodes[i.newest];if(p){let[r,c]=s(p.x,p.y);t.beginPath(),t.arc(r,c,3,0,Math.PI*2),t.fillStyle=u,t.fill()}}function S(i){}return g(),{resize:g,draw:h,pointer:S}}function B(){return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1}function D(){return window.matchMedia?.("(max-width: 799px)")?.matches??window.innerWidth<800}function K(){let e=document.querySelector("#nat-sim-canvas");if(!e)return;typeof window.__natSim=="function"&&(window.__natSim(),delete window.__natSim);let t=e.dataset.simSeed||"tarlton-nat",n=Number(e.dataset.simTick)>0?Number(e.dataset.simTick):N,o=D()?T:E,l=P(e),g=B(),b=g?O(t,o):I(t,o),h=0,S=0,i=0,a=!1,d=!0,u=!0,s={x:0,y:0},x=()=>l.draw(b,s),f=M=>{if(!a)return;let y=S?M-S:0;S=M,i+=y,i>=n&&(b=F(b,Math.min(i,n*3)),i=0,x()),h=requestAnimationFrame(f)},p=()=>{a||g||(a=!0,S=0,i=0,h=requestAnimationFrame(f))},r=()=>{a=!1,h&&cancelAnimationFrame(h),h=0},c=()=>{d&&u?p():r()},w=()=>{l.resize(),x()},m=M=>{let y=e.getBoundingClientRect();s={x:(M.clientX-y.left)/y.width*2-1,y:(M.clientY-y.top)/y.height*2-1}},v=()=>{s={x:0,y:0}},C=()=>{u=document.visibilityState==="visible",c()},_=new IntersectionObserver(M=>{d=M.some(y=>y.isIntersecting),c()},{threshold:.05});_.observe(e),document.addEventListener("visibilitychange",C),e.addEventListener("mousemove",m),e.addEventListener("mouseleave",v),window.addEventListener("resize",w),x(),c();let k=()=>{r(),_.disconnect(),document.removeEventListener("visibilitychange",C),e.removeEventListener("mousemove",m),e.removeEventListener("mouseleave",v),window.removeEventListener("resize",w),window.__natSim===k&&delete window.__natSim};window.__natSim=k,typeof window.addCleanup=="function"&&window.addCleanup(k)}K();})();\n';

// components-local/landing/src/Landing.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "preact/jsx-runtime";
var Landing = ({ fileData }) => {
  const hero = fileData.frontmatter?.hero ?? {};
  return /* @__PURE__ */ jsxs2("div", { class: "nat-landing", children: [
    /* @__PURE__ */ jsx2("section", { class: "nat-band nat-band--opening", children: /* @__PURE__ */ jsxs2("div", { class: "nat-band__grid", children: [
      /* @__PURE__ */ jsxs2("div", { class: "nat-band__text", children: [
        /* @__PURE__ */ jsx2("h1", { class: "nat-landing-name initial-cap", children: hero.name ?? "Mike Tarlton" }),
        /* @__PURE__ */ jsx2(SketchStroke, { variant: "name" }),
        /* @__PURE__ */ jsx2("p", { class: "nat-landing-identity voice", children: hero.identity }),
        /* @__PURE__ */ jsxs2("div", { class: "nat-landing-ctas", children: [
          hero.primaryCta?.href ? /* @__PURE__ */ jsx2("a", { class: "nat-cta", href: hero.primaryCta.href, target: "_blank", rel: "noopener", children: hero.primaryCta.label ?? "Faculty page" }) : null,
          /* @__PURE__ */ jsx2("a", { class: "nat-cta", href: "/attachments/tarlton-cv.pdf", download: true, children: "Download CV" })
        ] }),
        hero.status ? /* @__PURE__ */ jsx2("p", { class: "nat-landing-status nat-mono", children: hero.status }) : null
      ] }),
      hero.photo ? /* @__PURE__ */ jsx2("div", { class: "nat-plate-photo", children: /* @__PURE__ */ jsx2("img", { src: hero.photo, alt: hero.photoAlt ?? "", loading: "eager" }) }) : null
    ] }) }),
    /* @__PURE__ */ jsx2(MosaicBand, {}),
    /* @__PURE__ */ jsx2("section", { class: "nat-band nat-band--sim", children: /* @__PURE__ */ jsxs2("figure", { class: "nat-plate nat-sim-plate", children: [
      /* @__PURE__ */ jsx2(SketchFrame, {}),
      /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--tl", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--tr", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--bl", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--br", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx2(
        "canvas",
        {
          id: "nat-sim-canvas",
          class: "nat-sim-canvas",
          "data-sim": "tree",
          "data-sim-seed": "tarlton-nat",
          "data-sim-tick": "33",
          role: "img",
          "aria-label": "A growing branching graph, notebook ink"
        }
      ),
      /* @__PURE__ */ jsx2("figcaption", { class: "nat-plate__fig nat-mono", children: "FIG. 01 \xB7 growing graph" })
    ] }) }),
    /* @__PURE__ */ jsx2(MosaicBand, {}),
    /* @__PURE__ */ jsxs2("section", { class: "nat-band nat-band--research", children: [
      projects.map((p) => /* @__PURE__ */ jsxs2("div", { class: "nat-spread", children: [
        /* @__PURE__ */ jsxs2("div", { class: "nat-col", children: [
          /* @__PURE__ */ jsxs2("div", { class: "nat-col__main", children: [
            /* @__PURE__ */ jsx2("h2", { class: "nat-spread__q voice", children: p.q }),
            /* @__PURE__ */ jsx2("p", { class: "nat-spread__blurb", children: p.blurb }),
            /* @__PURE__ */ jsxs2("p", { class: "nat-spread__foot", children: [
              /* @__PURE__ */ jsx2("a", { class: "nat-spread__link", href: `/research/${p.slug}/`, children: p.name }),
              /* @__PURE__ */ jsx2("span", { class: "nat-spread__status nat-mono", children: p.status })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("aside", { class: "nat-col__aside nat-spread__margin", children: [
            /* @__PURE__ */ jsx2("span", { class: "nat-mono nat-spread__margin-label", children: "[placeholder marginalia]" }),
            /* @__PURE__ */ jsx2("p", { children: "Margin note goes here. The real marginalia is the author's own." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("figure", { class: "nat-plate nat-plate--figure", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--tl" }),
          /* @__PURE__ */ jsx2("span", { class: "nat-plate__corner nat-plate__corner--br" }),
          /* @__PURE__ */ jsx2(SprigMark, {})
        ] })
      ] }, p.slug)),
      /* @__PURE__ */ jsx2("ul", { class: "nat-also", children: also.map((a) => /* @__PURE__ */ jsxs2("li", { children: [
        /* @__PURE__ */ jsx2(
          "a",
          {
            href: a.href,
            target: a.href.startsWith("/") ? void 0 : "_blank",
            rel: "noopener",
            children: a.label
          }
        ),
        " ",
        /* @__PURE__ */ jsx2("span", { class: "nat-mono", children: a.meta })
      ] }, a.href)) })
    ] }),
    /* @__PURE__ */ jsx2(MosaicBand, {}),
    /* @__PURE__ */ jsx2("section", { class: "nat-band nat-band--door", children: /* @__PURE__ */ jsx2("a", { class: "nat-door", href: "/wiki/", children: /* @__PURE__ */ jsxs2("div", { class: "nat-door__panel", children: [
      /* @__PURE__ */ jsx2(DoorTree, {}),
      /* @__PURE__ */ jsx2("h2", { class: "nat-door__name", children: "The Cortex" }),
      /* @__PURE__ */ jsx2("p", { class: "nat-door__note voice", children: "Working notes, drafts, and the half-thoughts between." }),
      /* @__PURE__ */ jsx2("span", { class: "nat-door__go nat-mono", children: "enter" })
    ] }) }) }),
    /* @__PURE__ */ jsx2(MosaicBand, {}),
    /* @__PURE__ */ jsxs2("section", { class: "nat-band nat-band--contact", children: [
      /* @__PURE__ */ jsxs2("p", { class: "nat-contact__note voice", children: [
        "I answer quickly. Write me at ",
        /* @__PURE__ */ jsx2("a", { href: "mailto:M@Tarlton.info", children: "M@Tarlton.info" }),
        ", or find me on",
        " ",
        /* @__PURE__ */ jsx2("a", { href: "https://www.linkedin.com/in/m-tarlton/", target: "_blank", rel: "noopener", children: "LinkedIn" }),
        " ",
        "and",
        " ",
        /* @__PURE__ */ jsx2("a", { href: "https://github.com/MichaTarlton", target: "_blank", rel: "noopener", children: "GitHub" }),
        "."
      ] }),
      /* @__PURE__ */ jsx2(SketchStroke, {})
    ] })
  ] });
};
Landing.beforeDOMLoaded = `
  var p = location.pathname || "/";
  if (p === "/" || p === "/index.html") {
    document.documentElement.dataset.page = "index";
  }
`;
Landing.afterDOMLoaded = simMount_generated_default;
var Landing_default = (() => Landing);

// components-local/landing/src/index.ts
registerCondition("is-index", (props) => props.fileData.slug === "index");
export {
  Landing_default as Landing
};
