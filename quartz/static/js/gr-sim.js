// components-local/research/src/projects.ts
var nerRasterSeed = {
  rhythms: [3, 6, 12, 24, 36, 48],
  tcap: 24
};

// components-local/landing/src/sim.ts
var RHYTHMS = nerRasterSeed.rhythms;
var OSCILLATORS_FULL = 6;
var OSCILLATORS_MOBILE = 3;
var DECAY_TAU_S = 0.9;
var NEIGHBOR_NUDGE_PHASE = 6e-3;
var POINTER_NUDGE_MAX_PHASE = 0.06;
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function create(seed, opts = {}) {
  const count = opts.count ?? OSCILLATORS_FULL;
  const periodScale = opts.periodScale ?? 3;
  const rng = mulberry32(seed);
  const oscillators = [];
  for (let i = 0; i < count; i++) {
    const rhythm = RHYTHMS[i % RHYTHMS.length];
    oscillators.push({ row: i, period: rhythm * periodScale, phase: rng(), energy: 0 });
  }
  return {
    seed,
    periodScale,
    oscillators,
    time: 0,
    ticks: 0,
    spikes: [],
    spikeCount: 0,
    lastNudge: null
  };
}
function step(state, dtMs) {
  const dtS = dtMs / 1e3;
  const spikes = [];
  const nudges = [];
  for (const osc of state.oscillators) {
    osc.phase += dtS / osc.period;
    osc.energy *= Math.exp(-dtS / DECAY_TAU_S);
    if (osc.phase >= 1) {
      osc.phase -= 1;
      osc.energy += 1;
      spikes.push({ row: osc.row, t: state.time });
      if (osc.row > 0) nudges.push({ row: osc.row - 1, delta: -NEIGHBOR_NUDGE_PHASE });
      if (osc.row < state.oscillators.length - 1)
        nudges.push({ row: osc.row + 1, delta: NEIGHBOR_NUDGE_PHASE });
    }
  }
  for (const n of nudges) {
    const osc = state.oscillators[n.row];
    osc.phase = (osc.phase + n.delta + 1) % 1;
  }
  state.spikes = spikes;
  state.spikeCount += spikes.length;
  state.time += dtS;
  state.ticks += 1;
  return state;
}
function nudge(state, x01, y01) {
  const n = state.oscillators.length;
  const pos = Math.min(1, Math.max(0, y01 ?? x01));
  const row = Math.min(n - 1, Math.max(0, Math.round(pos * (n - 1))));
  const osc = state.oscillators[row];
  const delta = (Math.min(1, Math.max(0, x01)) - 0.5) * 2 * POINTER_NUDGE_MAX_PHASE;
  osc.phase = (osc.phase + delta + 1) % 1;
  const event = { row, delta };
  state.lastNudge = event;
  return event;
}
function frozenState(seed, opts = {}) {
  return create(seed, opts);
}

// components-local/landing/src/simView.ts
var MOUNT_ID = "gr-sim-mount";
var MAX_FPS = 30;
var FRAME_MS = 1e3 / MAX_FPS;
var SCROLL_PX_PER_S = 48;
var SEED_BASE = 1471;
var current = null;
function prefersReduced() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function mobileQuery() {
  return typeof matchMedia === "function" ? matchMedia("(max-width: 799px)") : null;
}
function seedFrom(mount) {
  let h = SEED_BASE;
  for (const ch of MOUNT_ID + (mount.dataset.simOscillators ?? "")) {
    h = Math.imul(h, 31) + ch.charCodeAt(0) | 0;
  }
  return h >>> 0;
}
function palette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    paper: v("--paper", "#f7f6f4"),
    ink: v("--ink", "#16161a"),
    gray: v("--gray", "#6a6a6a"),
    accent: v("--accent", "#e5231b"),
    hairline: v("--hairline-color", "#d5d4d1")
  };
}
function drawFrame(canvas, inst) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr);
  if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx || w < 2 || h < 2) return;
  const pal = palette();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = pal.paper;
  ctx.fillRect(0, 0, w, h);
  const oscs = inst.state.oscillators;
  const n = oscs.length;
  const insetY = Math.max(24, h * 0.12);
  const rowH = (h - insetY * 2) / n;
  const yOf = (row) => insetY + rowH * row + rowH / 2;
  ctx.lineWidth = 1;
  ctx.strokeStyle = pal.hairline;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const y = insetY + rowH * i;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  for (let x = 0; x <= w; x += 48) {
    ctx.moveTo(x, insetY);
    ctx.lineTo(x, h - insetY);
  }
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = pal.ink;
  ctx.beginPath();
  for (const osc of oscs) {
    const y = yOf(osc.row);
    const x = inst.xTime * SCROLL_PX_PER_S + osc.phase * rowH * 2.5;
    ctx.moveTo(x, y - rowH * 0.32);
    ctx.lineTo(x, y + rowH * 0.32);
  }
  ctx.stroke();
  const xNow = inst.xTime * SCROLL_PX_PER_S;
  for (const tk of inst.ticks) {
    const age = inst.state.time - tk.t;
    const alpha = Math.exp(-age / DECAY_TAU_S);
    if (alpha < 0.08) continue;
    const x = tk.t * SCROLL_PX_PER_S;
    if (x < xNow - w * 1.2 || x > xNow + w) continue;
    const y = yOf(tk.row);
    ctx.lineWidth = 2;
    ctx.strokeStyle = pal.ink;
    ctx.globalAlpha = 0.35 + 0.65 * alpha;
    ctx.beginPath();
    ctx.moveTo(x, y - rowH * 0.42);
    ctx.lineTo(x, y + rowH * 0.42);
    ctx.stroke();
    const size = 3 + 5 * alpha;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = pal.accent;
    ctx.fillRect(x - size / 2, y - rowH * 0.42 - size, size, size);
    ctx.globalAlpha = 1;
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = pal.ink;
  ctx.beginPath();
  ctx.moveTo(xNow, insetY);
  ctx.lineTo(xNow, h - insetY);
  ctx.stroke();
}
function teardown() {
  if (!current) return;
  if (current.raf) cancelAnimationFrame(current.raf);
  current.io?.disconnect();
  document.removeEventListener("visibilitychange", current.onVis);
  current.running = false;
  current = null;
}
function boot(mount) {
  teardown();
  const canvas = mount.querySelector("canvas");
  if (!canvas) return;
  const mq = mobileQuery();
  const isMobile = mq?.matches ?? window.innerWidth < 800;
  const count = isMobile ? OSCILLATORS_MOBILE : OSCILLATORS_FULL;
  const seed = seedFrom(mount);
  const reduced = prefersReduced();
  const annotTr = mount.querySelector(".gr-sim__annot--tr");
  if (annotTr && count !== OSCILLATORS_FULL) annotTr.textContent = `OSC ${count}`;
  const inst = {
    state: reduced ? frozenState(seed, { count }) : create(seed, { count }),
    ticks: [],
    xTime: 0,
    raf: 0,
    acc: 0,
    last: 0,
    visible: true,
    running: false,
    io: null,
    onVis: () => {
    },
    onMove: (e) => {
      const r = mount.getBoundingClientRect();
      nudge(inst.state, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      if (!inst.running) drawFrame(canvas, inst);
    }
  };
  mount.addEventListener("mousemove", inst.onMove);
  if (reduced) {
    drawFrame(canvas, inst);
    current = inst;
    return;
  }
  const tick = (now) => {
    if (!inst.running) return;
    inst.raf = requestAnimationFrame(tick);
    if (!inst.last) {
      inst.last = now;
      return;
    }
    inst.acc += Math.min(250, now - inst.last);
    inst.last = now;
    if (inst.acc < FRAME_MS) return;
    inst.acc -= FRAME_MS;
    step(inst.state, FRAME_MS);
    for (const s of inst.state.spikes) inst.ticks.push(s);
    inst.xTime += FRAME_MS / 1e3;
    const cutoff = inst.state.time - (canvas.clientWidth / SCROLL_PX_PER_S + 2);
    while (inst.ticks.length && inst.ticks[0].t < cutoff) inst.ticks.shift();
    drawFrame(canvas, inst);
  };
  const start = () => {
    if (inst.running) return;
    inst.running = true;
    inst.last = 0;
    inst.acc = 0;
    inst.raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    inst.running = false;
    if (inst.raf) cancelAnimationFrame(inst.raf);
    inst.raf = 0;
  };
  if (typeof IntersectionObserver !== "undefined") {
    inst.io = new IntersectionObserver(
      (entries) => {
        inst.visible = entries[entries.length - 1]?.isIntersecting ?? true;
        if (inst.visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    inst.io.observe(mount);
  } else {
    start();
  }
  inst.onVis = () => {
    if (document.hidden || !inst.visible) stop();
    else start();
  };
  document.addEventListener("visibilitychange", inst.onVis);
  current = inst;
}
function mountNode() {
  return document.getElementById(MOUNT_ID);
}
function tryBoot() {
  const mount = mountNode();
  if (mount) boot(mount);
  else teardown();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryBoot, { once: true });
  } else {
    tryBoot();
  }
  document.addEventListener("nav", tryBoot);
}
