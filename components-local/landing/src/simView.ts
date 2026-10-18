/**
 * Natural hero simulation renderer (Task 4).
 *
 * Canvas 2D on the landing's `#nat-sim-canvas` mount: 1px notebook-ink lines
 * with hand wobble, ornament gold on the newest node only (brief §5.3).
 * Pointer nudge: a gentle sway of young tips on mousemove over the canvas.
 *
 * Colour source: CSS custom properties on :root (the track tokens). The
 * ornament-gold and paper tokens are already exposed on :root by
 * _tokens.scss, so nothing is hardcoded here.
 *
 * Cadence is owned by the mount script (simMount.ts); this module only
 * measures, draws, and reacts to the pointer.
 */

import type { SimState } from "./sim"

/** CSS custom property names read from :root (see quartz/styles/_tokens.scss). */
export const TOKEN_VARS = {
  ink: "--nat-ink",
  ornamentGold: "--nat-ornament-gold",
  paper: "--nat-paper",
  surface: "--nat-surface",
} as const

/** Read a CSS custom property from :root, falling back when absent. */
export function readToken(name: string, fallback = ""): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export interface SimView {
  resize(): void
  /** Draw one frame; pointerNudge is in [-1,1] per axis (0 = centered). */
  draw(state: SimState, nudge: { x: number; y: number }): void
  /** Track pointer for the sway of young tips; null resets. */
  pointer(pos: { x: number; y: number } | null): void
}

export function createSimView(canvas: HTMLCanvasElement): SimView {
  const ctx = canvas.getContext("2d")
  let w = 0
  let h = 0
  let dpr = 1

  function resize() {
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.max(1, Math.floor(rect.width))
    h = Math.max(1, Math.floor(rect.height))
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function fit(state: SimState) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const n of state.nodes) {
      if (n.x < minX) minX = n.x
      if (n.y < minY) minY = n.y
      if (n.x > maxX) maxX = n.x
      if (n.y > maxY) maxY = n.y
    }
    if (!Number.isFinite(minX)) {
      minX = minY = maxX = maxY = 0
    }
    const spanX = Math.max(maxX - minX, 1)
    const spanY = Math.max(maxY - minY, 1)
    const pad = 18
    const scale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY, 6)
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    return (x: number, y: number): [number, number] => [
      w / 2 + (x - cx) * scale,
      h / 2 + (y - cy) * scale,
    ]
  }

  function draw(state: SimState, nudge: { x: number; y: number }) {
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)

    const ink = readToken(TOKEN_VARS.ink)
    const gold = readToken(TOKEN_VARS.ornamentGold)
    const by = fit(state)
    const now = state.tick

    // Hand wobble offsets: deterministic per (node, axis) from the id, so the
    // wobble is part of the drawing, not per-frame flicker.
    const wob = (id: number, axis: number) => Math.sin(id * 12.9898 + axis * 78.233) * 1.4

    ctx.lineWidth = 1 // notebook ink
    ctx.strokeStyle = ink
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    for (const n of state.nodes) {
      if (n.parent === null) continue
      const p = state.nodes[n.parent]
      const a = by(p.x, p.y)
      const b = by(n.x, n.y)
      // sway the young tips: nodes born within the last 6 ticks lean with the
      // pointer nudge, older ink is settled
      const age = now - n.born
      const sway = age <= 6 ? (1 - age / 7) * 3 : 0
      const sx = nudge.x * sway
      const sy = nudge.y * sway
      ctx.beginPath()
      ctx.moveTo(a[0] + wob(p.id, 0), a[1] + wob(p.id, 1))
      ctx.lineTo(b[0] + wob(n.id, 0) + sx, b[1] + wob(n.id, 1) + sy)
      ctx.stroke()
    }

    // gold accent on the newest node only
    const newest = state.nodes[state.newest]
    if (newest) {
      const [x, y] = by(newest.x, newest.y)
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = gold
      ctx.fill()
    }
  }

  function pointer(_pos: { x: number; y: number } | null) {
    // nudge values are computed by the mount (mousemove over the canvas);
    // kept here so the view owns all geometry decisions if that changes.
  }

  resize()
  return { resize, draw, pointer }
}
