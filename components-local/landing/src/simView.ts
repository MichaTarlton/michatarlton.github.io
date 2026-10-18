/**
 * Graphic Realism hero simulation — renderer + wiring (Task 4).
 *
 * Compiled by scripts/build-components.sh into quartz/static/js/gr-sim.js and
 * loaded by Landing.afterDOMLoaded's guarded loader, so this file must be
 * SELF-CONTAINED (no imports beyond sim.ts, no bundler assumptions).
 *
 * Look (brief §4.3): crisp 2px ink vector line on paper, raster tick rows
 * (FIG. 01 treatment: a vertical tick per spike on the oscillator's row, x
 * advancing with time), accent flash on spike (the tick and a row marker fill
 * in accent), hairline grid backdrop. No shadows, no gradients, radius 0.
 *
 * Cadence (motion budget §3): rAF accumulator capped at 30fps; Intersection
 * Observer pauses when the mount is offscreen; `visibilitychange` pauses when
 * hidden; `prefers-reduced-motion` renders ONE frozen spike-free frame and
 * never starts rAF; viewports <800px run the halved oscillator set (3).
 * Idempotent: a second boot (SPA nav) tears the previous instance down first.
 */
import {
  create,
  frozenState,
  nudge,
  step,
  DECAY_TAU_S,
  OSCILLATORS_FULL,
  OSCILLATORS_MOBILE,
  type SimState,
  type SpikeEvent,
} from "./sim"

const MOUNT_ID = "gr-sim-mount"
const MAX_FPS = 30
const FRAME_MS = 1000 / MAX_FPS
/** Raster advance: px of x per second of sim time (scrolling tick strip). */
const SCROLL_PX_PER_S = 48
/** Seed derived from the mount (stable across reloads and pages). */
const SEED_BASE = 0x5bf // "sbf"

interface Tick extends SpikeEvent {}

interface SimInstance {
  state: SimState
  ticks: Tick[]
  /** Raster x cursor in sim-time seconds. */
  xTime: number
  raf: number
  acc: number
  last: number
  visible: boolean
  running: boolean
  io: IntersectionObserver | null
  onVis: () => void
  onMove: (e: MouseEvent) => void
}

let current: SimInstance | null = null

function prefersReduced(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
}

function mobileQuery(): MediaQueryList | null {
  return typeof matchMedia === "function" ? matchMedia("(max-width: 799px)") : null
}

function seedFrom(mount: HTMLElement): number {
  // Stable, content-derived seed: the mount's identity + annotation count.
  let h = SEED_BASE
  for (const ch of MOUNT_ID + (mount.dataset.simOscillators ?? "")) {
    h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0
  }
  return h >>> 0
}

function palette(): { paper: string; ink: string; gray: string; accent: string; hairline: string } {
  const cs = getComputedStyle(document.documentElement)
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback
  return {
    paper: v("--paper", "#f7f6f4"),
    ink: v("--ink", "#16161a"),
    gray: v("--gray", "#6a6a6a"),
    accent: v("--accent", "#e5231b"),
    hairline: v("--hairline-color", "#d5d4d1"),
  }
}

function drawFrame(canvas: HTMLCanvasElement, inst: SimInstance): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr)
  if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx || w < 2 || h < 2) return

  const pal = palette()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = pal.paper
  ctx.fillRect(0, 0, w, h)

  const oscs = inst.state.oscillators
  const n = oscs.length
  const insetY = Math.max(24, h * 0.12)
  const rowH = (h - insetY * 2) / n
  const yOf = (row: number) => insetY + rowH * row + rowH / 2

  // hairline grid backdrop: rows + verticals on a 48px module
  ctx.lineWidth = 1
  ctx.strokeStyle = pal.hairline
  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const y = insetY + rowH * i
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
  }
  for (let x = 0; x <= w; x += 48) {
    ctx.moveTo(x, insetY)
    ctx.lineTo(x, h - insetY)
  }
  ctx.stroke()

  // crisp 2px ink vector line: the phase of every oscillator, drawn as a
  // phase-position bar per row (engineered readout, not a waveform squiggle).
  ctx.lineWidth = 2
  ctx.strokeStyle = pal.ink
  ctx.beginPath()
  for (const osc of oscs) {
    const y = yOf(osc.row)
    const x = inst.xTime * SCROLL_PX_PER_S + osc.phase * rowH * 2.5
    ctx.moveTo(x, y - rowH * 0.32)
    ctx.lineTo(x, y + rowH * 0.32)
  }
  ctx.stroke()

  // raster tick rows: one vertical tick per spike, x advancing with time.
  const xNow = inst.xTime * SCROLL_PX_PER_S
  for (const tk of inst.ticks) {
    const age = inst.state.time - tk.t
    const alpha = Math.exp(-age / DECAY_TAU_S)
    if (alpha < 0.08) continue
    const x = tk.t * SCROLL_PX_PER_S
    if (x < xNow - w * 1.2 || x > xNow + w) continue
    const y = yOf(tk.row)
    ctx.lineWidth = 2
    ctx.strokeStyle = pal.ink
    ctx.globalAlpha = 0.35 + 0.65 * alpha
    ctx.beginPath()
    ctx.moveTo(x, y - rowH * 0.42)
    ctx.lineTo(x, y + rowH * 0.42)
    ctx.stroke()
    // accent flash: the tick head fills in accent on spike (§4.2.9 mark use)
    const size = 3 + 5 * alpha
    ctx.globalAlpha = alpha
    ctx.fillStyle = pal.accent
    ctx.fillRect(x - size / 2, y - rowH * 0.42 - size, size, size)
    ctx.globalAlpha = 1
  }

  // scroll cursor: 2px ink rule marking "now"
  ctx.lineWidth = 2
  ctx.strokeStyle = pal.ink
  ctx.beginPath()
  ctx.moveTo(xNow, insetY)
  ctx.lineTo(xNow, h - insetY)
  ctx.stroke()
}

function teardown(): void {
  if (!current) return
  if (current.raf) cancelAnimationFrame(current.raf)
  current.io?.disconnect()
  document.removeEventListener("visibilitychange", current.onVis)
  current.running = false
  current = null
}

function boot(mount: HTMLElement): void {
  teardown()

  const canvas = mount.querySelector<HTMLCanvasElement>("canvas")
  if (!canvas) return

  const mq = mobileQuery()
  const isMobile = mq?.matches ?? window.innerWidth < 800
  const count = isMobile ? OSCILLATORS_MOBILE : OSCILLATORS_FULL
  const seed = seedFrom(mount)
  const reduced = prefersReduced()

  // keep the corner annotation truthful when the mobile set halves (wired data)
  const annotTr = mount.querySelector<HTMLElement>(".gr-sim__annot--tr")
  if (annotTr && count !== OSCILLATORS_FULL) annotTr.textContent = `OSC ${count}`

  const inst: SimInstance = {
    state: reduced ? frozenState(seed, { count }) : create(seed, { count }),
    ticks: [],
    xTime: 0,
    raf: 0,
    acc: 0,
    last: 0,
    visible: true,
    running: false,
    io: null,
    onVis: () => {},
    onMove: (e: MouseEvent) => {
      const r = mount.getBoundingClientRect()
      nudge(inst.state, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
      if (!inst.running) drawFrame(canvas, inst) // nudge feedback even while paused
    },
  }

  // pointer nudge (motion budget unchanged: pointer input is not cadence)
  mount.addEventListener("mousemove", inst.onMove)

  if (reduced) {
    // One frozen frame, spike-free steady state; never start rAF (§3).
    drawFrame(canvas, inst)
    current = inst
    return
  }

  const tick = (now: number) => {
    if (!inst.running) return
    inst.raf = requestAnimationFrame(tick)
    if (!inst.last) {
      inst.last = now
      return
    }
    inst.acc += Math.min(250, now - inst.last) // cap catch-up after stalls
    inst.last = now
    if (inst.acc < FRAME_MS) return
    inst.acc -= FRAME_MS
    step(inst.state, FRAME_MS)
    for (const s of inst.state.spikes) inst.ticks.push(s)
    inst.xTime += FRAME_MS / 1000
    // prune ticks older than the visible raster window
    const cutoff = inst.state.time - (canvas.clientWidth / SCROLL_PX_PER_S + 2)
    while (inst.ticks.length && inst.ticks[0].t < cutoff) inst.ticks.shift()
    drawFrame(canvas, inst)
  }

  const start = () => {
    if (inst.running) return
    inst.running = true
    inst.last = 0
    inst.acc = 0
    inst.raf = requestAnimationFrame(tick)
  }
  const stop = () => {
    inst.running = false
    if (inst.raf) cancelAnimationFrame(inst.raf)
    inst.raf = 0
  }

  // IntersectionObserver: pause when the mount scrolls offscreen
  if (typeof IntersectionObserver !== "undefined") {
    inst.io = new IntersectionObserver(
      (entries) => {
        inst.visible = entries[entries.length - 1]?.isIntersecting ?? true
        if (inst.visible && !document.hidden) start()
        else stop()
      },
      { threshold: 0 },
    )
    inst.io.observe(mount)
  } else {
    start()
  }

  // visibilitychange: pause in hidden tabs
  inst.onVis = () => {
    if (document.hidden || !inst.visible) stop()
    else start()
  }
  document.addEventListener("visibilitychange", inst.onVis)

  current = inst
}

function mountNode(): HTMLElement | null {
  return document.getElementById(MOUNT_ID)
}

function tryBoot(): void {
  const mount = mountNode()
  if (mount) boot(mount)
  else teardown()
}

if (typeof document !== "undefined") {
  // Guarded, idempotent self-init: run now if the mount exists, or on the SPA
  // `nav` event when the index arrives via the router (script stays loaded in
  // the head across navigations — see Landing.afterDOMLoaded loader).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryBoot, { once: true })
  } else {
    tryBoot()
  }
  document.addEventListener("nav", tryBoot)
}
