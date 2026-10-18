import { test } from "node:test"
import assert from "node:assert"

/**
 * Task 4 — hero simulation: pure growth model (components-local/landing/src/sim.ts).
 * No DOM here; the renderer/mount cadence is verified through the built page.
 */

import {
  create,
  step,
  frozenState,
  DEFAULT_CONFIG,
  MOBILE_CONFIG,
  FROZEN_TICKS,
  DEFAULT_TICK_MS,
  type SimConfig,
} from "../components-local/landing/src/sim"

const SEED = "tarlton-nat"

test("create: root node only, newest = root, tips = [root]", () => {
  const s = create(SEED)
  assert.equal(s.nodes.length, 1)
  assert.deepEqual(s.tips, [0])
  assert.equal(s.newest, 0)
  assert.equal(s.tick, 0)
  assert.equal(s.maxNodes, DEFAULT_CONFIG.maxNodes)
})

test("determinism: same seed + same dt sequence -> identical state", () => {
  const dts = [33, 33, 50, 16, 33, 99, 33, 20, 33]
  let a = create(SEED)
  let b = create(SEED)
  for (const dt of dts) {
    a = step(a, dt)
    b = step(b, dt)
  }
  assert.deepEqual(a, b)
  assert.ok(a.tick > 0)
  assert.ok(a.nodes.length > 1, "growth happened")
})

test("different seeds diverge", () => {
  let a = create("seed-a")
  let b = create("seed-b")
  for (let i = 0; i < 40; i++) {
    a = step(a, DEFAULT_TICK_MS)
    b = step(b, DEFAULT_TICK_MS)
  }
  const same = a.nodes.every((n, i) => n.x === b.nodes[i]?.x && n.y === b.nodes[i]?.y)
  assert.ok(!same, "distinct seeds should produce distinct drawings")
})

test("step purity: input state is never mutated", () => {
  const s = create(SEED)
  const snapshot = JSON.parse(JSON.stringify(s))
  step(s, 33)
  step(s, 900)
  assert.deepEqual(s, snapshot)
})

test("extension: each tick adds one node on the newest tip and moves the gold marker", () => {
  let s = create(SEED, { ...DEFAULT_CONFIG, forkChance: 0 })
  const first = step(s, DEFAULT_TICK_MS)
  assert.equal(first.nodes.length, 2)
  assert.equal(first.newest, 1, "newest marker moved to the extension")
  assert.deepEqual(first.tips, [1], "tip advanced to the new node")
  s = first
  const second = step(s, DEFAULT_TICK_MS)
  assert.equal(second.nodes.length, 3)
  assert.equal(second.newest, 2)
  assert.equal(second.nodes[2].parent, 1)
})

test("wobble is bounded: deviation stays within the configured wobble angle", () => {
  let s = create(SEED, { ...DEFAULT_CONFIG, forkChance: 0 })
  for (let i = 0; i < 60; i++) s = step(s, DEFAULT_TICK_MS)
  for (const n of s.nodes) {
    if (n.parent === null) continue
    const p = s.nodes[n.parent]
    const d = Math.abs(((n.angle - p.angle + Math.PI) % (2 * Math.PI)) - Math.PI)
    assert.ok(d <= s.wobble + 1e-9, `wobble ${d} exceeds bound ${s.wobble}`)
  }
})

test("fork adds a new tip and stays under the cap", () => {
  const cfg: SimConfig = { ...DEFAULT_CONFIG, forkChance: 1, maxNodes: 240 }
  const s = step(create(SEED, cfg), DEFAULT_TICK_MS)
  assert.equal(s.nodes.length, 3, "root + extension + fork")
  assert.equal(s.tips.length, 2, "fork adds a tip")
  assert.equal(s.tips[0], 1, "first tip is the extension")
  assert.equal(s.tips[1], 2, "new tip is the fork")
  assert.equal(s.nodes[2].parent, 1, "fork hangs from the extension")
  assert.equal(s.newest, 1, "gold marker follows the extension, not the fork")
})

test("cap holds: growth halts at maxNodes and freezes the drawing", () => {
  const cfg: SimConfig = { ...DEFAULT_CONFIG, maxNodes: 12 }
  let s = create(SEED, cfg)
  for (let i = 0; i < 100; i++) s = step(s, DEFAULT_TICK_MS)
  assert.equal(s.nodes.length, 12, "node count capped")
  assert.ok(s.tips.length >= 1)
  const frozen = step(s, DEFAULT_TICK_MS * 5)
  assert.equal(frozen.nodes.length, 12)
  assert.deepEqual(frozen.nodes, s.nodes, "at cap, ink is settled: no new growth")
  assert.ok(frozen.tick > s.tick, "clock keeps ticking, growth stops")
})

test("dt accounting: sub-tick time is carried, not dropped", () => {
  let a = create(SEED)
  let b = create(SEED)
  // 100ms in one call vs 100ms in 10ms drips (33ms tick) — same tick count
  a = step(a, 100)
  for (let i = 0; i < 10; i++) b = step(b, 10)
  assert.equal(a.tick, b.tick)
  assert.deepEqual(a, b)
})

test("reduced motion: frozenState is a settled deterministic frame, not the seed", () => {
  const f1 = frozenState(SEED)
  const f2 = frozenState(SEED)
  assert.deepEqual(f1, f2, "frozen frame is deterministic")
  assert.equal(f1.tick, FROZEN_TICKS)
  assert.ok(f1.nodes.length > 10, "frozen frame shows a grown graph")
  assert.ok(f1.nodes.length <= DEFAULT_CONFIG.maxNodes)
  assert.ok(f1.carry === 0, "no leftover cadence in a frozen frame")
})

test("mobile reduction: fewer nodes, fewer tips, slower growth", () => {
  const desktop = frozenState(SEED, DEFAULT_CONFIG)
  const mobile = frozenState(SEED, MOBILE_CONFIG)
  assert.ok(MOBILE_CONFIG.maxNodes < DEFAULT_CONFIG.maxNodes)
  assert.ok(MOBILE_CONFIG.forkChance < DEFAULT_CONFIG.forkChance)
  assert.ok(mobile.nodes.length < desktop.nodes.length)
  assert.ok(mobile.tips.length <= desktop.tips.length)
})

test("newest marker always points at a live node", () => {
  let s = create(SEED)
  for (let i = 0; i < 80; i++) {
    s = step(s, DEFAULT_TICK_MS)
    assert.ok(s.newest >= 0 && s.newest < s.nodes.length)
    assert.equal(s.nodes[s.newest].born <= s.tick, true)
  }
})
