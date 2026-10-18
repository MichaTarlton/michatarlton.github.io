/**
 * Natural hero simulation mount (Task 4): the cadence glue that runs in the
 * browser. Wired via `Landing.afterDOMLoaded` as a string static (Quartz
 * component contract); built to `simMount.generated.js` by
 * scripts/build-components.sh and inlined as a plain string in Landing.tsx —
 * no runtime import of the bundle, matching the old hero's landingScript
 * pattern.
 *
 * Self-initializing, guarded on `#nat-sim-canvas`. Cadence mechanics:
 *  - rAF accumulator capped at 30fps (data-sim-tick, default 33ms);
 *  - IntersectionObserver pauses when the plate scrolls offscreen;
 *  - document.visibilitychange pauses when the tab is hidden;
 *  - prefers-reduced-motion renders ONE frozen frame and never starts rAF;
 *  - mobile (<800px) uses the reduced tip count / growth rate;
 *  - pointer nudge: gentle sway of young tips on mousemove over the canvas.
 *
 * Idempotent across SPA navigations: Quartz re-executes head scripts on nav,
 * so a previous instance (if any) is torn down first — observers, listeners,
 * rAF — and window.addCleanup registers the teardown for prenav cleanup.
 */

import { create, step, frozenState, DEFAULT_CONFIG, MOBILE_CONFIG, DEFAULT_TICK_MS } from "./sim"
import type { SimState } from "./sim"
import { createSimView } from "./simView"

interface Teardown {
  (): void
}

declare global {
  interface Window {
    __natSim?: Teardown
    // addCleanup is already declared non-optional by globals.d.ts — do not re-declare
    // it here (an optional re-declaration makes it undefinedable at engine call sites).
  }
}

function reducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

function isMobile(): boolean {
  return window.matchMedia?.("(max-width: 799px)")?.matches ?? window.innerWidth < 800
}

function mount(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#nat-sim-canvas")
  if (!canvas) return

  // tear down a previous instance before re-initializing (SPA navigation)
  if (typeof window.__natSim === "function") {
    window.__natSim()
    delete window.__natSim
  }

  const seed = canvas.dataset.simSeed || "tarlton-nat"
  const tickMs =
    Number(canvas.dataset.simTick) > 0 ? Number(canvas.dataset.simTick) : DEFAULT_TICK_MS
  const config = isMobile() ? MOBILE_CONFIG : DEFAULT_CONFIG

  const view = createSimView(canvas)

  // Reduced motion: ONE frozen frame — a settled moment of the same
  // deterministic growth — and rAF never starts. Otherwise: the live seed.
  const reduced = reducedMotion()
  let state: SimState = reduced ? frozenState(seed, config) : create(seed, config)

  let raf = 0
  let last = 0
  let acc = 0
  let running = false
  let onscreen = true
  let visible = true
  let nudge = { x: 0, y: 0 }

  const drawFrame = () => view.draw(state, nudge)

  const loop = (now: number) => {
    if (!running) return
    const dt = last ? now - last : 0
    last = now
    acc += dt
    // accumulator cap: step at most once per tick, and never let a
    // hidden-tab backlog storm in (max 3 ticks per frame)
    if (acc >= tickMs) {
      state = step(state, Math.min(acc, tickMs * 3))
      acc = 0
      drawFrame()
    }
    raf = requestAnimationFrame(loop)
  }

  const start = () => {
    if (running || reduced) return
    running = true
    last = 0
    acc = 0
    raf = requestAnimationFrame(loop)
  }

  const stop = () => {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const setPaused = () => {
    if (onscreen && visible) start()
    else stop()
  }

  const onResize = () => {
    view.resize()
    drawFrame()
  }

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    nudge = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    }
  }

  const onMouseLeave = () => {
    nudge = { x: 0, y: 0 }
  }

  const onVisibility = () => {
    visible = document.visibilityState === "visible"
    setPaused()
  }

  const io = new IntersectionObserver(
    (entries) => {
      onscreen = entries.some((entry) => entry.isIntersecting)
      setPaused()
    },
    { threshold: 0.05 },
  )
  io.observe(canvas)

  document.addEventListener("visibilitychange", onVisibility)
  canvas.addEventListener("mousemove", onMouseMove)
  canvas.addEventListener("mouseleave", onMouseLeave)
  window.addEventListener("resize", onResize)

  drawFrame() // first frame immediately (the frozen one, under reduced motion)
  setPaused() // no-op under reduced motion: start() refuses

  const teardown: Teardown = () => {
    stop()
    io.disconnect()
    document.removeEventListener("visibilitychange", onVisibility)
    canvas.removeEventListener("mousemove", onMouseMove)
    canvas.removeEventListener("mouseleave", onMouseLeave)
    window.removeEventListener("resize", onResize)
    if (window.__natSim === teardown) delete window.__natSim
  }
  window.__natSim = teardown

  // Quartz SPA: run teardown on prenav so nothing leaks into the next page
  if (typeof window.addCleanup === "function") {
    window.addCleanup(teardown)
  }
}

mount()
