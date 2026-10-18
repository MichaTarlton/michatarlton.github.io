/**
 * Natural hero simulation (Task 4): a growing branching graph in the
 * znah.net/graphs lineage — this track's Tree-of-Life subject (brief §5.3).
 *
 * Pure module: no DOM, no timers. `create(seed)` starts a root node;
 * `step(state, dtMs)` advances one tick: the newest tip extends with
 * notebook-ink wobble (bounded random angle per tick), and with a small
 * probability per tick the tip forks into a new branch. One node — the
 * newest — carries the gold marker; it moves on every extension.
 *
 * Determinism: the state carries its own mulberry32 PRNG state, so the same
 * seed and the same dt sequence always produce the same state. `dtMs` is
 * normalized to whole ticks (33 ms default ≈ 30 fps); leftover time is
 * carried so cadence jitter never changes the sequence.
 */

export interface SimNode {
  id: number
  x: number
  y: number
  /** growth heading, radians */
  angle: number
  /** parent id, or null for the root */
  parent: number | null
  /** tick the node was born on */
  born: number
}

export interface SimState {
  nodes: SimNode[]
  /** ids of live growth tips */
  tips: number[]
  /** the single gold-marked node; moves on each extension */
  newest: number
  /** node count cap: when reached, growth halts (documented below) */
  maxNodes: number
  /** per-tick fork probability */
  forkChance: number
  /** extension step in normalized units (renderer scales) */
  stepLen: number
  /** max deviation from the parent heading, radians */
  wobble: number
  tick: number
  seed: string
  /** mulberry32 PRNG state, part of the state for determinism */
  rng: number
  /** ms carried over from the previous step() */
  carry: number
}

export interface SimConfig {
  maxNodes: number
  forkChance: number
  stepLen: number
  wobble: number
}

/** Desktop default: ~240 nodes per the plan. */
export const DEFAULT_CONFIG: SimConfig = {
  maxNodes: 240,
  forkChance: 0.06,
  stepLen: 1.15,
  wobble: 0.42,
}

/**
 * Mobile (<800px) reduction (brief §3 motion budget): fewer tips and a slower
 * growth cadence — half the fork probability (fewer branches) and a shorter
 * step.
 */
export const MOBILE_CONFIG: SimConfig = {
  maxNodes: 140,
  forkChance: 0.03,
  stepLen: 0.9,
  wobble: 0.42,
}

/** Default tick length in ms (matches data-sim-tick on the mount). */
export const DEFAULT_TICK_MS = 33

function hashSeed(seed: string): number {
  // FNV-1a, 32-bit
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32: returns [nextState, value in [0,1)]. */
function nextRng(state: number): [number, number] {
  const s = (state + 0x6d2b79f5) >>> 0
  let t = s
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return [s, ((t ^ (t >>> 14)) >>> 0) / 4294967296]
}

export function create(seed: string, config: SimConfig = DEFAULT_CONFIG): SimState {
  const root: SimNode = { id: 0, x: 0, y: 0, angle: -Math.PI / 2, parent: null, born: 0 }
  return {
    nodes: [root],
    tips: [0],
    newest: 0,
    maxNodes: config.maxNodes,
    forkChance: config.forkChance,
    stepLen: config.stepLen,
    wobble: config.wobble,
    tick: 0,
    seed,
    rng: hashSeed(seed),
    carry: 0,
  }
}

/**
 * Advance the state by `dtMs` milliseconds, consuming whole ticks.
 * Returns a new state; the input is never mutated.
 *
 * Cap behaviour (documented): when `nodes.length` reaches `maxNodes` growth
 * stops entirely — the graph freezes as a finished drawing inside the plate.
 * No recycle: recycling would redraw settled ink and break the "one hand, one
 * pass" notebook feel.
 */
export function step(state: SimState, dtMs: number): SimState {
  let s: SimState = { ...state, carry: state.carry + Math.max(0, dtMs) }
  while (s.carry >= DEFAULT_TICK_MS) {
    s = tickOnce(s)
    s = { ...s, carry: s.carry - DEFAULT_TICK_MS }
  }
  return s
}

function tickOnce(s: SimState): SimState {
  if (s.nodes.length >= s.maxNodes) {
    return { ...s, tick: s.tick + 1 }
  }

  const tipId = s.tips[s.tips.length - 1]
  const tip = s.nodes[tipId]
  let rng = s.rng

  // notebook-ink wobble: bounded random deviation from the parent heading
  const [r1, wa] = nextRng(rng)
  rng = r1
  const angle = tip.angle + (wa * 2 - 1) * s.wobble

  const [r2, len] = nextRng(rng)
  rng = r2
  const sl = s.stepLen * (0.8 + 0.4 * len)

  const id = s.nodes.length
  const node: SimNode = {
    id,
    x: tip.x + Math.cos(angle) * sl,
    y: tip.y + Math.sin(angle) * sl,
    angle,
    parent: tip.id,
    born: s.tick + 1,
  }

  const nodes = [...s.nodes, node]
  const tips = [...s.tips]
  tips[tips.length - 1] = id

  // occasional fork: split the current tip into a second branch
  const [r3, fr] = nextRng(rng)
  rng = r3
  if (fr < s.forkChance && nodes.length < s.maxNodes) {
    const [r4, fa] = nextRng(rng)
    rng = r4
    const fAngle = angle + (fa < 0.5 ? -1 : 1) * (0.5 + 0.45 * fa)
    const fId = nodes.length
    nodes.push({
      id: fId,
      x: node.x,
      y: node.y,
      angle: fAngle,
      parent: node.id,
      born: s.tick + 1,
    })
    tips.push(fId)
  }

  return {
    ...s,
    nodes,
    tips,
    newest: id, // the gold marker moves with every extension
    tick: s.tick + 1,
    rng,
  }
}

/** Ticks grown for the reduced-motion frozen frame (~4s of growth). */
export const FROZEN_TICKS = 120

/**
 * Reduced-motion path (brief §3): the frozen single frame is not the empty
 * seed but a finished moment of the same deterministic growth — grow the
 * state `ticks` ticks and stop. No rAF, no further mutation.
 */
export function frozenState(
  seed: string,
  config: SimConfig = DEFAULT_CONFIG,
  ticks: number = FROZEN_TICKS,
): SimState {
  let s = create(seed, config)
  for (let i = 0; i < ticks; i++) s = tickOnce(s)
  return s
}
