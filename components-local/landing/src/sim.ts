/**
 * SBF oscillator bank — pure simulation model for the Graphic Realism hero
 * (brief §4.3 "Hero Simulation": the shipped SBF oscillator bank with spiking).
 *
 * No DOM, no timers, no randomness from the environment: `create(seed)` plus
 * `step(state, dtMs)` is deterministic for the same seed and dt sequence.
 * The renderer (simView.ts) and the tests consume this module only.
 *
 * Model: N oscillators with periods from the NER raster rhythms (Task 1 data,
 * `nerRasterSeed.rhythms` = [3,6,12,24,36,48] seconds), scaled by
 * `periodScale`. Each tick advances every phase by dt/period; a phase that
 * wraps past 1 emits a spike event on that oscillator row and raises its
 * energy, which decays exponentially; a spike nudges each neighbour's phase
 * slightly (deterministic pull toward the spike). Pointer input nudges the
 * oscillator whose row is nearest the pointer.
 */

import { nerRasterSeed } from "../../research/src/projects"

/**
 * Oscillator period multipliers, carried from the original NER raster figure
 * (projects.ts `nerRasterSeed.rhythms` = [3,6,12,24,36,48]). Data-only import.
 */
export const RHYTHMS: readonly number[] = nerRasterSeed.rhythms

/** Oscillator count at ≥800px; below that the set is halved (motion budget). */
export const OSCILLATORS_FULL = 6
export const OSCILLATORS_MOBILE = 3

/** Energy decay time constant in seconds (spike flash / raster tick fade). */
export const DECAY_TAU_S = 0.9

/** Phase pull a spike applies to each adjacent oscillator row. */
export const NEIGHBOR_NUDGE_PHASE = 0.006

/** Max phase shift a pointer nudge applies to the nearest row. */
export const POINTER_NUDGE_MAX_PHASE = 0.06

/** One oscillator of the bank. */
export interface Oscillator {
  /** Row index, 0-based (oscillator 0 is the top raster row). */
  row: number
  /** Period in seconds. */
  period: number
  /** Phase in [0, 1); a wrap past 1 emits a spike. */
  phase: number
  /** Spike energy ≥ 0, decays exponentially toward 0. */
  energy: number
}

/** A spike emitted on the tick its phase wrapped (ordered by row). */
export interface SpikeEvent {
  row: number
  /** Global time (seconds) at the wrap. */
  t: number
}

/** A pointer nudge recorded on `nudge()` (for tests / instrumentation). */
export interface NudgeEvent {
  row: number
  /** Signed phase shift applied. */
  delta: number
}

/** Immutable-by-convention simulation state; only sim.ts writes it. */
export interface SimState {
  seed: number
  /** Seconds per phase cycle for the fastest oscillator. */
  periodScale: number
  oscillators: Oscillator[]
  /** Global time in seconds (sum of stepped dt). */
  time: number
  /** Count of ticks advanced. */
  ticks: number
  /** Spikes emitted on the most recent `step` (cleared each step). */
  spikes: SpikeEvent[]
  /** Total spikes since create. */
  spikeCount: number
  /** Last pointer nudge, if any (most recent only). */
  lastNudge: NudgeEvent | null
}

export interface CreateOptions {
  /** Number of oscillators (6 desktop, 3 mobile); default 6. */
  count?: number
  /** Seconds for one phase cycle of oscillator 0; default 3. */
  periodScale?: number
}

/** mulberry32 — seeded PRNG (deterministic; the only stochastic source). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Initial state: phases deterministically scrambled from `seed`, all energies
 * 0. Spikes are emitted only when a phase actually wraps, so a freshly created
 * state (or one run through `frozenState`) is spike-free — the reduced-motion
 * path renders exactly this without starting time.
 */
export function create(seed: number, opts: CreateOptions = {}): SimState {
  const count = opts.count ?? OSCILLATORS_FULL
  const periodScale = opts.periodScale ?? 3
  const rng = mulberry32(seed)
  const oscillators: Oscillator[] = []
  for (let i = 0; i < count; i++) {
    const rhythm = RHYTHMS[i % RHYTHMS.length]
    oscillators.push({ row: i, period: rhythm * periodScale, phase: rng(), energy: 0 })
  }
  return {
    seed,
    periodScale,
    oscillators,
    time: 0,
    ticks: 0,
    spikes: [],
    spikeCount: 0,
    lastNudge: null,
  }
}

/**
 * Advance the simulation by `dtMs` milliseconds. Deterministic given the
 * current state and dt. A phase that wraps past 1 emits a spike event on that
 * oscillator row; energies decay exponentially; each spike pulls adjacent
 * rows' phases slightly toward it. Returns the same (mutated) state for
 * chaining — callers never copy.
 */
export function step(state: SimState, dtMs: number): SimState {
  const dtS = dtMs / 1000
  const spikes: SpikeEvent[] = []
  const nudges: { row: number; delta: number }[] = []

  for (const osc of state.oscillators) {
    osc.phase += dtS / osc.period
    osc.energy *= Math.exp(-dtS / DECAY_TAU_S)
    if (osc.phase >= 1) {
      osc.phase -= 1
      osc.energy += 1
      spikes.push({ row: osc.row, t: state.time })
      // neighbor pull: sign toward the spiking row (deterministic)
      if (osc.row > 0) nudges.push({ row: osc.row - 1, delta: -NEIGHBOR_NUDGE_PHASE })
      if (osc.row < state.oscillators.length - 1)
        nudges.push({ row: osc.row + 1, delta: NEIGHBOR_NUDGE_PHASE })
    }
  }

  for (const n of nudges) {
    const osc = state.oscillators[n.row]
    osc.phase = (osc.phase + n.delta + 1) % 1
  }

  state.spikes = spikes
  state.spikeCount += spikes.length
  state.time += dtS
  state.ticks += 1
  return state
}

/**
 * Pointer nudge: shift the phase of the oscillator row nearest the pointer
 * (x/y in [0,1] of the sim surface, y defaulting to the row axis as x).
 * Returns the nudge event recorded on `state.lastNudge`.
 */
export function nudge(state: SimState, x01: number, y01?: number): NudgeEvent {
  const n = state.oscillators.length
  const pos = Math.min(1, Math.max(0, y01 ?? x01))
  const row = Math.min(n - 1, Math.max(0, Math.round(pos * (n - 1))))
  const osc = state.oscillators[row]
  // Signed: pointer right of center pushes the phase forward, left pulls back.
  const delta = (Math.min(1, Math.max(0, x01)) - 0.5) * 2 * POINTER_NUDGE_MAX_PHASE
  osc.phase = (osc.phase + delta + 1) % 1
  const event: NudgeEvent = { row, delta }
  state.lastNudge = event
  return event
}

/**
 * Reduced-motion path: the frozen frame is the *spike-free steady state* —
 * the created state itself. No time advances, no spikes ever emit, and the
 * caller must never start rAF on this state.
 */
export function frozenState(seed: number, opts: CreateOptions = {}): SimState {
  return create(seed, opts)
}
