/**
 * Research project data — Natural track.
 * Values extracted verbatim from the original build's ResearchPage.tsx
 * (lines 151–221) before the wipe. Data only: no markup, no classes.
 */

export interface Output {
  label: string
  href: string
}

export interface Project {
  slug: string
  name: string
  status: string
  venue: string
  q: string
  meta: string
  blurb: string
  summary: string
  outputs: Output[]
}

export interface AlsoItem {
  label: string
  meta: string
  href: string
}

/** NER raster figure seed values (raster rhythms + tick cap); markup is re-implemented per track. */
export const nerRasterSeed = {
  rhythms: [3, 6, 12, 24, 36, 48],
  tcap: 24,
}

export const projects: Project[] = [
  {
    slug: "ner-2025",
    name: "SBF-Automata",
    status: "Published",
    venue: "Principal author, spotlight poster at IEEE NER 2025 in San Diego",
    q: "Can the brain's way of keeping time make machine learning cheaper at the edge?",
    meta: "SBF-Automata, IEEE NER 2025",
    blurb:
      "I transposed the striatal beat-frequency model into a reinforcement-learning automaton that learns intervals online, encoded directly in its weights, and showed it works at the edge in O(N) localized updates, with no central clock and no global error signal.",
    summary:
      "Periodicity finding is a workload the brain does for free and machines do expensively. I built a reinforcement-learning automaton from the striatal beat-frequency model of interval timing: a bank of oscillating units whose weights learn which periodicities predict reward, updating locally and online. Against FFT, autocorrelation and Autoperiod, SBF-A matched or beat them in speed, stability and accuracy, in O(N) per update, suited to neuromorphic edge hardware.",
    outputs: [
      {
        label: "Paper PDF",
        href: "/attachments/EMBS NER 2025 - Investigation of Novel SBF-Automata Architecture for Periodicity Finding Solutions at Edge Systems - Tarlton.pdf",
      },
    ],
  },
  {
    slug: "phd-overview",
    name: "PhD Research Overview",
    status: "In progress",
    venue: "PhD candidate in artificial intelligence at Oslo Metropolitan University, since 2022",
    q: "How does time itself emerge from the plasticity of single neurons?",
    meta: "PhD research, OsloMet",
    blurb:
      "My doctoral programme designs learning rules for deep spiking neural networks in which spike-timing plasticity gives rise to temporal dynamics, for online, always-on, low-energy learning machines.",
    summary:
      "Biological brains compute with time (spike intervals, synchrony, oscillations), and artificial networks largely ignore it. My PhD asks whether the brain's time-based mechanisms can become practical learning rules: spike-timing plasticity as a learning signal, oscillator-based computation, and temporal structure that emerges from the plasticity of individual neurons. The goal is machine learning that is online, always-on, and radically low-energy.",
    outputs: [
      { label: "Poster", href: "/research/ner-2025/" },
      { label: "Essay", href: "/wiki/" },
    ],
  },
  {
    slug: "masters-thesis",
    name: "MSc Thesis: Model Selection for Ising Inference",
    status: "Published",
    venue: "MSc in neuroscience, Roudi group, Kavli Institute at NTNU, 2021",
    q: "How do you choose the right model when inferring networks from spiking data?",
    meta: "MSc thesis, Kavli Institute at NTNU",
    blurb:
      "I derived and tested an information-based Bayesian criterion for choosing among Ising-model networks when inferring connectivity from neural spiking, with the simulations and evaluation run on HPC clusters.",
    summary:
      "Record a population of neurons and you can ask how its cells are connected, but every answer depends on the model you choose to infer with: too simple misses structure, too complex fits noise. My thesis evaluated a novel information-based Bayesian criterion for exactly this choice, across candidate Ising-model topologies, simulated at scale on NTNU's IDUN cluster.",
    outputs: [
      {
        label: "Thesis PDF",
        href: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2783337?locale-attribute=en",
      },
    ],
  },
]

export const also: AlsoItem[] = [
  {
    label: "Oscillatory Timing Models in RL-Automata (AAMAS 2024)",
    meta: "Poster (PDF)",
    href: "/attachments/aamas-2024-oscillatory-timing-models.pdf",
  },
  {
    label:
      "Experiencing a Slice of the Sky: Immersive Rendering and Sonification of Antarctic Astronomy Data",
    meta: "Mixed-media installation, xREZ Art + Science Lab, UNT",
    href: "https://doi.org/10.2352/ISSN.2470-1173.2018.03.ERVR-449",
  },
]
