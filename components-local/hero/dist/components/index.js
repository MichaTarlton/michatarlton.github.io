// components-local/hero/src/landingScript.ts
var landingScript_default = `(function () {
  var VARIANTS = ["a", "b", "c"];
  var html = document.documentElement;
  var raf = 0;
  var motionState = "idle";
  function motionParam() { return new URLSearchParams(location.search).get("motion"); }
  function reducedMotion() {
    var m = motionParam();
    if (m === "on") return false;
    if (m === "off") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function current() {
    var v = html.getAttribute("data-variant") || "a";
    return VARIANTS.indexOf(v) >= 0 ? v : "a";
  }

  function label() {
    var v = current();
    var el = document.querySelector(".landing.variant-" + v);
    var name = el ? el.getAttribute("data-variant-name") : "";
    var ms = document.querySelector(".proto-motion");
    if (ms) ms.textContent = "motion: " + motionState;
  }

  function setVariant(v) {
    html.setAttribute("data-variant", v);
    var u = new URL(location.href);
    u.searchParams.set("variant", v);
    history.replaceState(null, "", u.toString());
    label();
    startField();
  }


  var bar = document.querySelector(".proto-bar");
  // Bar is hidden by default since the cutover fold (ticket 17); reveal only
  // for explicit prototyping via ?proto=1.
  if (bar && new URLSearchParams(location.search).has("proto")) bar.removeAttribute("hidden");
  // Only the landing's bar carries .proto-motion; on research pages the hero bar
  // is absent and the research bar has no motion button. Guard so a missing
  // button can't throw and abort the rest of the shared postscript bundle.
  if (bar && bar.querySelector(".proto-motion") && !bar.dataset.wired) {
    bar.dataset.wired = "1";
    bar.querySelector(".proto-motion").addEventListener("click", function (e) {
      e.preventDefault();
      var u = new URL(location.href);
      u.searchParams.set("motion", reducedMotion() ? "on" : "off");
      location.href = u.toString();
    });
    bar.querySelector(".proto-theme").addEventListener("click", function (e) {
      e.preventDefault();
      var dark = html.getAttribute("saved-theme") === "dark";
      var u = new URL(location.href);
      if (dark) { u.searchParams.delete("dark"); } else { u.searchParams.set("dark", "1"); }
      localStorage.setItem("theme", dark ? "light" : "dark");
      location.href = u.toString();
    });
  }
  // \u2500\u2500 Ambient vector field \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function startField() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var v = current();
    var canvas = document.querySelector(".landing.variant-" + v + " canvas.field-canvas");
    if (!canvas) { motionState = "no canvas in variant " + v.toUpperCase(); label(); return; }
    var p = window.__proto;
    if (p === "gr") return startSBF(canvas);
    if (p === "nat") return startBranch(canvas);
    if (reducedMotion()) { motionState = "OFF (prefers-reduced-motion" + (motionParam() ? ", ?motion=" + motionParam() : " from OS") + ") \u2014 click to force on"; label(); return; }
    motionState = "running" + (motionParam() === "on" ? " (forced)" : "");
    label();
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
  // \u2500\u2500 Shared 30 fps throttle for the proto hero sims \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // fn must re-arm itself: raf = requestAnimationFrame(tick).
  function cadence(fn, fps) {
    var last = 0, gap = 1000 / (fps || 30) - 1;
    function tick(t) {
      if (t - last < gap) { raf = requestAnimationFrame(tick); return; }
      last = t;
      fn(t);
    }
    return tick;
  }
  function protoSmall() {
    return window.matchMedia("(max-width: 800px)").matches || !!(navigator.connection && navigator.connection.saveData);
  }
  function protoHost(canvas) { return canvas.closest(".a-hero") || canvas.parentElement; }
  function protoPoint(canvas, e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom };
  }

  // \u2500\u2500 GR hero: SBF oscillator bank, vector ink \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function startSBF(canvas) {
    var ctx = canvas.getContext("2d");
    var reduced = reducedMotion();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var N = protoSmall() ? 80 : 160;
    var K = 3;
    var W = 0, H = 0, neurons = [];
    var pointer = { x: -1e4, y: -1e4 };
    var onscreen = true;
    var col = { sec: "#1b3fd8", mark: "#e5231b" };
    var host = protoHost(canvas);
    motionState = reduced ? "frozen (reduced motion)" : "running (gr)";
    label();

    function readColors() {
      var cs = getComputedStyle(html);
      var a = cs.getPropertyValue("--secondary").trim();
      var b = cs.getPropertyValue("--accent-mark").trim();
      if (a) col.sec = a;
      if (b) col.mark = b;
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function init() {
      neurons = [];
      for (var i = 0; i < N; i++) {
        neurons.push({ x: Math.random(), y: Math.random(), f: 0.5 + Math.random() * 1.4, p: Math.random() * Math.PI * 2, s: 0, nb: [] });
      }
      for (var a = 0; a < N; a++) {
        var dists = [];
        for (var b = 0; b < N; b++) {
          if (a === b) continue;
          var dx = neurons[a].x - neurons[b].x, dy = neurons[a].y - neurons[b].y;
          dists.push([dx * dx + dy * dy, b]);
        }
        dists.sort(function (u, v) { return u[0] - v[0]; });
        for (var k = 0; k < K; k++) neurons[a].nb.push(dists[k][1]);
      }
    }
    function step(dt) {
      for (var i = 0; i < N; i++) {
        var n = neurons[i];
        n.p += n.f * dt * Math.PI * 2 * 0.55;
        var dx = n.x * W - pointer.x, dy = n.y * H - pointer.y, r2 = dx * dx + dy * dy;
        if (r2 < 12000) n.p += dt * 16 * (1 - r2 / 12000);
        if (n.p >= Math.PI * 2) {
          n.p -= Math.PI * 2;
          n.s = 1;
          for (var k = 0; k < n.nb.length; k++) neurons[n.nb[k]].p += 0.35;
        }
        // heroSim decays 0.90 per 60 Hz frame; 0.81 matches that at 30 fps
        n.s *= reduced ? 0.90 : 0.81;
      }
    }
    function burst(x, y) {
      for (var i = 0; i < N; i++) {
        var n = neurons[i], dx = n.x * W - x, dy = n.y * H - y;
        if (dx * dx + dy * dy < 20000) n.s = 1;
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2;
      ctx.lineCap = "butt";
      ctx.strokeStyle = col.sec;
      for (var i = 0; i < N; i++) {
        var n = neurons[i];
        for (var k = 0; k < n.nb.length; k++) {
          var m = neurons[n.nb[k]];
          ctx.globalAlpha = 0.12 + 0.3 * Math.max(n.s, m.s);
          ctx.beginPath(); ctx.moveTo(n.x * W, n.y * H); ctx.lineTo(m.x * W, m.y * H); ctx.stroke();
        }
      }
      for (var j = 0; j < N; j++) {
        var q = neurons[j], x = q.x * W, y = q.y * H;
        ctx.globalAlpha = 0.8; ctx.fillStyle = col.sec;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        if (q.s > 0.03) {
          ctx.globalAlpha = q.s * 0.9; ctx.fillStyle = col.mark;
          ctx.beginPath(); ctx.arc(x, y, 2 + 6 * (1 - q.s), 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = q.s * 0.5; ctx.strokeStyle = col.mark;
          ctx.beginPath(); ctx.arc(x, y, 3 + 14 * (1 - q.s), 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = col.sec;
        }
      }
      ctx.globalAlpha = 1;
    }

    readColors(); resize(); init();
    document.addEventListener("themechange", function () { readColors(); if (reduced && document.body.contains(canvas)) draw(); });
    window.addEventListener("resize", function () { if (!document.body.contains(canvas)) return; resize(); if (reduced) draw(); });
    if (reduced) {
      for (var s = 0; s < 240; s++) step(0.016);
      draw();
      return;
    }
    host.addEventListener("pointermove", function (e) { var p = protoPoint(canvas, e); pointer.x = p.x; pointer.y = p.y; });
    host.addEventListener("pointerleave", function () { pointer.x = -1e4; pointer.y = -1e4; });
    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest("a,button,input")) return;
      var p = protoPoint(canvas, e);
      if (p.inside) burst(p.x, p.y);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { onscreen = en[0].isIntersecting; }, { threshold: 0.05 }).observe(canvas);
    }
    var last = 0;
    var tick = cadence(function (t) {
      if (!document.body.contains(canvas)) return;
      var dt = Math.min(0.05, (t - last) / 1000 || 0.033); last = t;
      if (onscreen && document.visibilityState === "visible") { step(dt); draw(); }
      raf = requestAnimationFrame(tick);
    }, 30);
    raf = requestAnimationFrame(tick);
  }
  // \u2500\u2500 Natural hero: growing branching graph, notebook ink \u2500\u2500\u2500\u2500\u2500\u2500
  function startBranch(canvas) {
    var ctx = canvas.getContext("2d");
    var reduced = reducedMotion();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var small = protoSmall();
    var CAP = small ? 70 : 140;
    var ROOTS = small ? 2 : 3;
    var MAXGEN = 5, SPLIT = 0.09;
    var W = 0, H = 0, segs = [], tips = [], newest = null, beat = 0;
    var onscreen = true;
    var col = { ink: "#3a4a8f", gold: "#c9a227" };
    var host = protoHost(canvas);
    motionState = reduced ? "frozen (reduced motion)" : "running (nat)";
    label();

    function readColors() {
      var cs = getComputedStyle(html);
      var a = cs.getPropertyValue("--secondary").trim();
      var g = cs.getPropertyValue("--proto-gilding").trim();
      if (a) col.ink = a;
      if (g) col.gold = g;
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function addTip(x, y, a, gen, list) {
      (list || tips).push({ x: x, y: y, a: a, gen: gen, life: 8 + Math.floor(Math.random() * 5) });
    }
    function reset() {
      segs = []; tips = []; newest = null;
      for (var i = 0; i < ROOTS; i++) addTip(W * (i + 1) / (ROOTS + 1), H, -Math.PI / 2 + (Math.random() - 0.5) * 0.4, 0);
    }
    function advance() {
      var next = [];
      for (var i = 0; i < tips.length; i++) {
        var t = tips[i];
        if (segs.length >= CAP || t.life <= 0 || t.x < 0 || t.x > W || t.y < 0 || t.y > H + 4) continue;
        t.a += (Math.random() - 0.5) * 0.4;
        var len = 7 + Math.random() * 5;
        var nx = t.x + Math.cos(t.a) * len + (Math.random() - 0.5) * 1.4;
        var ny = t.y + Math.sin(t.a) * len + (Math.random() - 0.5) * 1.4;
        segs.push({ x1: t.x, y1: t.y, x2: nx, y2: ny });
        newest = { x: nx, y: ny };
        t.x = nx; t.y = ny; t.life--;
        if (t.gen < MAXGEN && Math.random() < SPLIT) {
          addTip(nx, ny, t.a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.4), t.gen + 1, next);
        }
        next.push(t);
      }
      tips = next;
    }
    function seed(x, y) {
      if (segs.length + 12 > CAP) segs.splice(0, segs.length + 12 - CAP);
      for (var i = 0; i < 3; i++) addTip(x, y, -Math.PI / 2 + (Math.random() - 0.5) * 2.2, 2);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.lineCap = "round";
      ctx.strokeStyle = col.ink; ctx.globalAlpha = 0.8;
      ctx.beginPath();
      for (var i = 0; i < segs.length; i++) { ctx.moveTo(segs[i].x1, segs[i].y1); ctx.lineTo(segs[i].x2, segs[i].y2); }
      ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = col.gold;
      if (newest) { ctx.beginPath(); ctx.arc(newest.x, newest.y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    }

    readColors(); resize(); reset();
    document.addEventListener("themechange", function () { readColors(); if (document.body.contains(canvas)) draw(); });
    window.addEventListener("resize", function () {
      if (!document.body.contains(canvas)) return;
      resize(); reset();
      if (reduced) { for (var s = 0; s < 300; s++) advance(); draw(); }
    });
    if (reduced) {
      for (var s = 0; s < 300; s++) advance();
      draw();
      return;
    }
    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest("a,button,input")) return;
      var p = protoPoint(canvas, e);
      if (p.inside) seed(p.x, p.y);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var was = onscreen;
        onscreen = en[0].isIntersecting;
        if (onscreen && !was && document.body.contains(canvas)) draw();
      }, { threshold: 0.05 }).observe(canvas);
    }
    var tick = cadence(function () {
      if (!document.body.contains(canvas)) return;
      if (onscreen && document.visibilityState === "visible" && tips.length) {
        beat++;
        if (beat % 2 === 0) { advance(); draw(); }
      }
      raf = requestAnimationFrame(tick);
    }, 30);
    raf = requestAnimationFrame(tick);
  }
  // PROTOTYPE CHIP: delete with the prototype
  function protoStored() {
    try { return localStorage.getItem("proto"); } catch (e) { return null; }
  }
  function protoGo(v) {
    var q = new URLSearchParams(location.search);
    if (v === "off") {
      try { localStorage.removeItem("proto"); } catch (e) {}
      q.delete("proto");
    } else {
      q.set("proto", v);
    }
    var qs = q.toString();
    location.href = location.pathname + (qs ? "?" + qs : "") + location.hash;
  }
  function protoChip() {
    var param = new URLSearchParams(location.search).get("proto");
    var stored = protoStored();
    var existing = document.querySelector(".proto-chip");
    if (
      !window.__proto &&
      param !== "gr" &&
      param !== "nat" &&
      param !== "off" &&
      stored !== "gr" &&
      stored !== "nat"
    ) {
      if (existing) existing.parentNode.removeChild(existing);
      return;
    }
    if (existing) return;
    var chip = document.createElement("div");
    chip.className = "proto-chip";
    chip.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;gap:2px;padding:4px;font:600 11px/1 monospace;background:rgba(20,20,20,.85);border-radius:6px;";
    ["gr", "nat", "off"].forEach(function (v) {
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = v.toUpperCase();
      a.style.cssText = "padding:5px 8px;border-radius:4px;text-decoration:none;color:" + (v === window.__proto || (v === "off" && !window.__proto) ? "#111;background:#fff" : "#fff");
      a.addEventListener("click", function (e) { e.preventDefault(); protoGo(v); });
      chip.appendChild(a);
    });
    document.body.appendChild(chip);
  }
  function protoFont() {
    // shortcut: runtime injection; move to build config if the GR track graduates.
    if (html.getAttribute("data-proto") !== "gr" || document.getElementById("proto-archivo")) return;
    var l = document.createElement("link");
    l.id = "proto-archivo";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap";
    l.setAttribute("data-persist", "");
    document.head.appendChild(l);
  }
  function boot() {
    var cur = html.getAttribute("data-proto");
    window.__proto = cur === "gr" || cur === "nat" ? cur : null;
    label();
    startField();
    protoChip();
    protoFont();
  }
  boot();
  document.addEventListener("nav", boot); // Quartz SPA: re-init on every navigation
})();`;

// components-local/hero/src/proto.ts
var PROTO_BOOT_SCRIPT = `(function(){
  var h=document.documentElement,v=null,s=null;
  try{v=new URLSearchParams(location.search).get("proto");s=localStorage.getItem("proto");}catch(e){}
  if(v==="off"){
    try{localStorage.removeItem("proto");}catch(e){}
    h.removeAttribute("data-proto");
  }else if(v==="gr"||v==="nat"){
    try{localStorage.setItem("proto",v);}catch(e){}
    h.setAttribute("data-proto",v);
  }else if(s==="gr"||s==="nat"){
    h.setAttribute("data-proto",s);
  }else{
    h.removeAttribute("data-proto");
  }
})();`;

// components-local/hero/src/Hero.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var research = [
  {
    n: "01",
    href: "/research/ner-2025/",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata, IEEE NER 2025",
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
    meta: "PhD research, OsloMet",
    blurb: "Designing learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics, for online, always-on, low-energy learning.",
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
    meta: "MSc thesis, Kavli Institute at NTNU",
    blurb: "An information-based Bayesian criterion for inferring Ising-model networks from neural spiking activity, designed, simulated, and evaluated on HPC clusters.",
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
var Photo = ({ size, hero }) => hero.photo ? /* @__PURE__ */ jsx(
  "img",
  {
    class: `photo photo-${size}`,
    src: hero.photo,
    alt: hero.photoAlt ?? hero.name ?? "Portrait",
    width: size === "lg" ? 132 : 64,
    height: size === "lg" ? 132 : 64
  }
) : /* @__PURE__ */ jsx("div", { class: `photo photo-${size}`, "aria-label": "Photo placeholder", children: /* @__PURE__ */ jsx("span", { children: "MT" }) });
var Ctas = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "ctas", children: [
  hero.primaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-primary", href: hero.primaryCta.href, children: hero.primaryCta.label }),
  hero.secondaryCta && /* @__PURE__ */ jsx("a", { class: "cta cta-secondary", href: hero.secondaryCta.href, children: hero.secondaryCta.label }),
  /* @__PURE__ */ jsx("a", { class: "cta cta-secondary", href: "/cv/", children: "CV" })
] });
var Status = ({ text }) => text ? /* @__PURE__ */ jsxs("p", { class: "status", children: [
  /* @__PURE__ */ jsx("span", { class: "status-dot", "aria-hidden": "true" }),
  text
] }) : null;
var Contact = () => /* @__PURE__ */ jsxs("section", { class: "contact", children: [
  /* @__PURE__ */ jsx("h2", { children: "Contact" }),
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
var Landing = ({ hero }) => /* @__PURE__ */ jsxs("div", { class: "landing variant-a", children: [
  /* @__PURE__ */ jsxs("section", { class: "a-hero", children: [
    /* @__PURE__ */ jsxs("div", { class: "a-field", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { class: "grid-paper" }),
      /* @__PURE__ */ jsx("canvas", { class: "field-canvas", "data-field": "hero" })
    ] }),
    /* @__PURE__ */ jsxs("div", { class: "a-hero-inner", children: [
      /* @__PURE__ */ jsx(Photo, { size: "lg", hero }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Status, { text: hero.status ?? "" }),
        /* @__PURE__ */ jsx("h1", { class: "display", children: hero.name }),
        /* @__PURE__ */ jsx("p", { class: "lede", children: hero.identity }),
        /* @__PURE__ */ jsx(Ctas, { hero })
      ] }),
      /* @__PURE__ */ jsxs("aside", { class: "proto-marginalia", "data-placeholder": "true", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 96 22", width: "96", height: "22", fill: "none", stroke: "currentColor", "stroke-width": "1", "stroke-linecap": "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M2 15 C 14 2, 26 2, 36 11 S 58 20, 70 9 S 88 4, 94 12" }) }),
        /* @__PURE__ */ jsx("span", { children: "placeholder" })
      ] })
    ] })
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
  /* @__PURE__ */ jsx("section", { class: "cortex-door", children: /* @__PURE__ */ jsxs("a", { href: "/wiki/", children: [
    /* @__PURE__ */ jsx("span", { "data-track-glyph": "gr", "aria-hidden": "true", children: "\u25B6\u25B6" }),
    /* @__PURE__ */ jsx("span", { "data-track-glyph": "nat", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "none", stroke: "currentColor", "stroke-width": "1", children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "9", height: "9" }),
      /* @__PURE__ */ jsx("rect", { x: "13", y: "2", width: "9", height: "9" }),
      /* @__PURE__ */ jsx("rect", { x: "2", y: "13", width: "9", height: "9" }),
      /* @__PURE__ */ jsx("rect", { x: "13", y: "13", width: "9", height: "9" })
    ] }) }),
    /* @__PURE__ */ jsx("span", { class: "door-name", children: "The Cortex" }),
    /* @__PURE__ */ jsx("span", { class: "door-flavor", children: "the Neuro-AI knowledge garden" }),
    /* @__PURE__ */ jsx("span", { class: "door-enter", children: "Enter the Cortex \u2192" })
  ] }) }),
  /* @__PURE__ */ jsx(Contact, {})
] });
var Hero = ({ fileData }) => {
  if (fileData.slug !== "index") return null;
  const hero = fileData.frontmatter?.hero ?? {};
  hero.name ??= "Mike Tarlton";
  hero.identity ??= "Neuro-AI researcher building brain-inspired learning systems.";
  return /* @__PURE__ */ jsx("div", { class: "landing-proto", children: /* @__PURE__ */ jsx(Landing, { hero }) });
};
Hero.beforeDOMLoaded = `(function(){
  // PROTOTYPE: light is the design; force light on the landing unless ?dark.
  var p=new URLSearchParams(location.search);
  if(location.pathname==="/"||location.pathname==="/index.html"){
    if(!p.has("dark")){localStorage.setItem("theme","light");document.documentElement.setAttribute("saved-theme","light");}
  }
  document.documentElement.setAttribute("data-variant","a");
})();
` + PROTO_BOOT_SCRIPT;
Hero.afterDOMLoaded = landingScript_default;
var Hero_default = (() => Hero);
export {
  Hero_default as Hero
};
