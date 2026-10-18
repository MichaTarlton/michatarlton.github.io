import { test } from "node:test"
import assert from "node:assert"
import {
  create,
  step,
  nudge,
  frozenState,
  mulberry32,
  RHYTHMS,
  POINTER_NUDGE_MAX_PHASE,
  DECAY_TAU_S,
  type SimState,
} from "../components-local/landing/src/sim"

/**
 * Task 4 — SBF oscillator bank pure-model tests (no DOM).
 * Determinism, spike-on-wrap, decay monotonicity, pointer nudge, reduced-motion
 * frozen state.
 */

/** Deep snapshot of the stateful parts of a SimState. */
function snapshot(s: SimState) {
  return {
    time: s.time,
    ticks: s.ticks,
    spikeCount: s.spikeCount,
    spikes: [...s.spikes],
    oscillators: s.oscillators.map((o) => ({ ...o })),
  }
}

test("create is deterministic from seed and uses NER rhythms", () => {
  const a = create(1234)
  const b = create(1234)
  assert.deepEqual(snapshot(a), snapshot(b))
  assert.equal(a.oscillators.length, 6)
  assert.deepEqual(
    a.oscillators.map((o) => o.period),
    RHYTHMS.map((r) => r * 3),
  )
  for (const o of a.oscillators) {
    assert.ok(o.phase >= 0 && o.phase < 1)
    assert.equal(o.energy, 0)
  }
})

test("step purity/determinism: same seed + dt sequence -> same state", () => {
  const dts = [33, 33, 34, 33, 33, 33, 33, 33, 100, 500, 16, 33]
  const a = create(7)
  const b = create(7)
  for (const dt of dts) {
    step(a, dt)
    step(b, dt)
  }
  assert.deepEqual(snapshot(a), snapshot(b))
  assert.equal(a.time, b.time)
})

test("step advances phase by dt/period and is pure (no hidden state)", () => {
  const s = create(1)
  s.oscillators.forEach((o) => (o.phase = 0.5))
  const before = s.oscillators.map((o) => o.phase)
  // dt = 33ms: nothing wraps from 0.5, so phases move by exactly dt/period
  step(s, 33)
  for (let i = 0; i < s.oscillators.length; i++) {
    const o = s.oscillators[i]
    const expected = before[i] + 0.033 / o.period
    assert.ok(Math.abs(o.phase - expected) < 1e-9)
    assert.equal(o.energy, 0)
  }
  assert.equal(s.spikes.length, 0)
  assert.equal(s.time, 0.033)
})

test("spike at wrap: phase crossing 1 emits a spike event and raises energy", () => {
  const s = create(5, { periodScale: 3 })
  s.oscillators.forEach((o) => (o.phase = 0.5))
  const row0 = s.oscillators[0]
  row0.phase = 0.998
  // 33ms at 9s period advances 0.00367 → 1.00167 crosses 1 on row 0
  step(s, 33)
  assert.equal(row0.energy, 1)
  assert.ok(row0.phase < 1)
  assert.deepEqual(
    s.spikes.map((sp) => sp.row),
    [0],
  )
  assert.equal(s.spikeCount, 1)
  // spike list is per-step: cleared on the next quiet step
  step(s, 10)
  assert.equal(s.spikes.length, 0)
  assert.equal(s.spikeCount, 1)
})

test("spike nudges neighbor phases (deterministic pull)", () => {
  const s = create(9)
  s.oscillators.forEach((o) => (o.phase = 0.5))
  const neighborBefore = s.oscillators[1].phase
  s.oscillators[0].phase = 0.999
  step(s, 33)
  // row 1 phase moved by exactly the neighbor pull (0.5 + pull, no wrap of row 1)
  assert.notEqual(s.oscillators[1].phase, neighborBefore)
  assert.ok(s.oscillators[1].phase > neighborBefore)
})

test("energy decays exponentially and monotonically between spikes", () => {
  const s = create(11)
  s.oscillators.forEach((o) => (o.phase = 0.5))
  s.oscillators[0].energy = 1
  const series: number[] = []
  for (let i = 0; i < 30; i++) {
    step(s, 33) // small dt: nothing wraps from 0.5
    series.push(s.oscillators[0].energy)
  }
  for (let i = 1; i < series.length; i++) {
    assert.ok(series[i] < series[i - 1], `energy not monotonic at ${i}: ${series[i]}`)
  }
  assert.ok(series[series.length - 1] > 0)
  // analytic check: 33ms step -> exp(-0.033/tau) factor
  const expected = Math.exp((-30 * 0.033) / DECAY_TAU_S)
  assert.ok(Math.abs(series[29] - expected) < 1e-6)
})

test("nudge changes the phase of the nearest oscillator row", () => {
  const s = create(13)
  s.oscillators.forEach((o) => (o.phase = 0.5))
  const ev = nudge(s, 0, 0.5) // far left => negative pull
  assert.equal(ev.row, 3) // y=0.5 of 6 rows -> round(0.5*5)=3 (index 2? round(2.5)=3? JS rounds .5 up)
  assert.equal(ev.delta, -POINTER_NUDGE_MAX_PHASE)
  assert.notEqual(s.oscillators[ev.row].phase, 0.5)
  assert.ok(Math.abs(s.oscillators[ev.row].phase - (0.5 - POINTER_NUDGE_MAX_PHASE)) < 1e-9)
  assert.equal(s.lastNudge, ev)

  const ev2 = nudge(s, 1, 0) // top row, far right => positive pull
  assert.equal(ev2.row, 0)
  assert.ok(Math.abs(s.oscillators[0].phase - (0.5 + POINTER_NUDGE_MAX_PHASE)) < 1e-9)
})

test("nudge is a no-op on center for phase but still records the row", () => {
  const s = create(17)
  s.oscillators.forEach((o) => (o.phase = 0.42))
  const ev = nudge(s, 0.5, 1)
  assert.equal(ev.delta, 0)
  assert.equal(ev.row, 5)
  assert.ok(Math.abs(s.oscillators[5].phase - 0.42) < 1e-9)
})

test("mobile halved set: count=3 keeps rows and rhythms prefix", () => {
  const s = create(19, { count: 3 })
  assert.equal(s.oscillators.length, 3)
  assert.deepEqual(
    s.oscillators.map((o) => o.period),
    RHYTHMS.slice(0, 3).map((r) => r * 3),
  )
})

test("reduced-motion frozen state: spike-free steady state, never advances", () => {
  const f = frozenState(23, { count: 6 })
  assert.equal(f.time, 0)
  assert.equal(f.ticks, 0)
  assert.equal(f.spikeCount, 0)
  assert.equal(f.spikes.length, 0)
  for (const o of f.oscillators) assert.equal(o.energy, 0)
  // deterministic: same seed -> identical frozen frame
  assert.deepEqual(snapshot(f), snapshot(frozenState(23, { count: 6 })))
  // and it matches the created state exactly (frozen == created, un-stepped)
  assert.deepEqual(snapshot(f), snapshot(create(23, { count: 6 })))
})

test("mulberry32 is a deterministic seeded PRNG in [0,1)", () => {
  const r1 = mulberry32(42)
  const r2 = mulberry32(42)
  for (let i = 0; i < 100; i++) {
    const v = r1()
    assert.equal(v, r2())
    assert.ok(v >= 0 && v < 1)
  }
})
