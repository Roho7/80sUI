import { renderSoundPatch } from "@/lib/sound/render"
import type { SoundCrush, SoundFilter, SoundJitter, SoundLayer, SoundPatch, SoundWave } from "@/lib/sound/types"

export { DEFAULT_JITTER } from "@/lib/sound/render"

export type Wave = SoundWave
export type FilterSpec = SoundFilter
export type Layer = SoundLayer
export type Crush = SoundCrush
export type Jitter = SoundJitter

export type Patch = SoundPatch & {
  id: string
  name: string
  note: string
  cutAt?: number
}

export type RenderOptions = {
  sampleRate: number
  jitter: boolean
}

export function renderPatch(patch: Patch, options: RenderOptions): Float32Array {
  const samples = renderSoundPatch(patch, options)
  if (patch.cutAt === undefined) {
    return samples
  }
  return samples.subarray(0, Math.max(1, Math.floor(samples.length * patch.cutAt)))
}

export type ClickAnalysis = {
  durationMs: number
  peak: number
  startJump: number
  endJump: number
  tailJump: number
}

export function analyzeSamples(samples: Float32Array, sampleRate: number): ClickAnalysis {
  let peak = 0
  for (const value of samples) {
    peak = Math.max(peak, Math.abs(value))
  }
  const tail = Math.min(samples.length - 1, Math.ceil(sampleRate * 0.001))
  let tailJump = 0
  for (let index = samples.length - tail; index < samples.length; index += 1) {
    tailJump = Math.max(tailJump, Math.abs(samples[index] - samples[index - 1]))
  }
  return {
    durationMs: (samples.length / sampleRate) * 1000,
    peak,
    startJump: Math.abs(samples[0] ?? 0),
    endJump: Math.abs(samples[samples.length - 1] ?? 0),
    tailJump,
  }
}

export function toDecibels(value: number, reference: number): string {
  if (value <= 1e-7 || reference <= 0) {
    return "-inf"
  }
  return (20 * Math.log10(value / reference)).toFixed(1)
}

const thockNoise: Layer[] = [
  { wave: "sine", frequency: 200, frequencyEnd: 80, pitchTime: 0.03, attack: 0.001, decay: 0.065, gain: 0.7 },
  { wave: "noise", frequency: 0, attack: 0.0005, decay: 0.012, gain: 0.35, filter: { type: "bandpass", frequency: 2500, q: 1.2 } },
]

export const wavePatches: Patch[] = [
  { id: "sine-1200", name: "Sine 1200", note: "1 ms / 25 ms, round and soft", layers: [{ wave: "sine", frequency: 1200, attack: 0.001, decay: 0.025, gain: 0.5 }] },
  { id: "square-1200", name: "Square 1200", note: "Same envelope, buzzy, every odd harmonic", layers: [{ wave: "square", frequency: 1200, attack: 0.001, decay: 0.025, gain: 0.22 }] },
  { id: "blend-1200", name: "Blend 70/30", note: "70% sine, 30% square: body plus edge", layers: [{ wave: "blend", sineShare: 0.7, frequency: 1200, attack: 0.001, decay: 0.025, gain: 0.4 }] },
  { id: "square-lp-1200", name: "Square LP 2k", note: "Square through a 2 kHz lowpass", layers: [{ wave: "square", frequency: 1200, attack: 0.001, decay: 0.025, gain: 0.35, filter: { type: "lowpass", frequency: 2000, q: 0.7 } }] },
]

export const envelopePatches: Patch[] = [
  { id: "env-0-2", name: "0.2 / 2 ms", note: "Square 5 kHz, a pip", layers: [{ wave: "square", frequency: 5000, attack: 0.0002, decay: 0.002, gain: 0.25 }] },
  { id: "env-1-4", name: "1 / 4 ms", note: "Square 3 kHz, a tick", layers: [{ wave: "square", frequency: 3000, attack: 0.001, decay: 0.004, gain: 0.25 }] },
  { id: "env-1-10", name: "1 / 10 ms", note: "Blend 1.6 kHz, a click", layers: [{ wave: "blend", frequency: 1600, attack: 0.001, decay: 0.01, gain: 0.4 }] },
  { id: "env-2-20", name: "2 / 20 ms", note: "Blend 800 Hz, a tock", layers: [{ wave: "blend", frequency: 800, attack: 0.002, decay: 0.02, gain: 0.45 }] },
  { id: "env-5-30", name: "5 / 30 ms", note: "Sine 400 Hz, a blip", layers: [{ wave: "sine", frequency: 400, attack: 0.005, decay: 0.03, gain: 0.6 }] },
]

export const pitchPatches: Patch[] = [300, 800, 2000, 4500].map((frequency) => ({
  id: `pitch-${frequency}`,
  name: `${frequency} Hz`,
  note: "Blend 1 / 12 ms",
  layers: [{ wave: "blend", frequency, attack: 0.001, decay: 0.012, gain: frequency > 3000 ? 0.25 : 0.45 }],
}))

export const thockPatches: Patch[] = [
  { id: "thock-sine", name: "Thock sine", note: "Sine 240 to 80 Hz in 30 ms, 70 ms decay", layers: [{ wave: "sine", frequency: 240, frequencyEnd: 80, pitchTime: 0.03, attack: 0.001, decay: 0.07, gain: 0.75 }] },
  { id: "thock-square-lp", name: "Thock square LP", note: "Square 180 to 70 Hz through 900 Hz lowpass", layers: [{ wave: "square", frequency: 180, frequencyEnd: 70, pitchTime: 0.03, attack: 0.001, decay: 0.06, gain: 0.5, filter: { type: "lowpass", frequency: 900, q: 1 } }] },
  { id: "thock-tick", name: "Thock + tick", note: "Sine drop plus a 4 ms 2.6 kHz square clack", layers: [
    { wave: "sine", frequency: 220, frequencyEnd: 85, pitchTime: 0.03, attack: 0.001, decay: 0.06, gain: 0.7 },
    { wave: "square", frequency: 2600, attack: 0.0005, decay: 0.004, gain: 0.12 },
  ] },
  { id: "thock-noise", name: "Thock + noise", note: "Sine drop plus a 12 ms bandpassed noise burst", layers: thockNoise },
  { id: "thunk-deep", name: "Deep thunk", note: "Sine 130 to 50 Hz, 120 ms, lowpassed noise", layers: [
    { wave: "sine", frequency: 130, frequencyEnd: 50, pitchTime: 0.05, attack: 0.001, decay: 0.12, gain: 0.85 },
    { wave: "noise", frequency: 0, attack: 0.0005, decay: 0.02, gain: 0.4, filter: { type: "lowpass", frequency: 600, q: 0.7 } },
  ] },
]

export type PatchPair = { id: string; name: string; note: string; first: Patch; second: Patch }

export const pressReleasePairs: PatchPair[] = [
  {
    id: "keycap",
    name: "Keycap",
    note: "Press thocks, release is a faint high clack",
    first: { id: "keycap-press", name: "Keycap press", note: "", layers: thockNoise },
    second: { id: "keycap-release", name: "Keycap release", note: "", layers: [
      { wave: "square", frequency: 1800, attack: 0.0005, decay: 0.006, gain: 0.1 },
      { wave: "sine", frequency: 400, frequencyEnd: 300, pitchTime: 0.02, attack: 0.001, decay: 0.02, gain: 0.18 },
    ] },
  },
  {
    id: "tactile",
    name: "Tactile switch",
    note: "Bump click on press, a lighter one on release",
    first: { id: "tactile-press", name: "Tactile press", note: "", layers: [
      { wave: "noise", frequency: 0, attack: 0.0003, decay: 0.006, gain: 0.6, filter: { type: "bandpass", frequency: 3500, q: 2 } },
      { wave: "square", frequency: 2200, attack: 0.0005, decay: 0.005, gain: 0.15 },
    ] },
    second: { id: "tactile-release", name: "Tactile release", note: "", layers: [
      { wave: "noise", frequency: 0, attack: 0.0003, decay: 0.004, gain: 0.35, filter: { type: "bandpass", frequency: 4200, q: 2 } },
      { wave: "square", frequency: 2600, attack: 0.0005, decay: 0.004, gain: 0.08 },
    ] },
  },
  {
    id: "dome",
    name: "Rubber dome",
    note: "Muffled, low sines only",
    first: { id: "dome-press", name: "Dome press", note: "", layers: [{ wave: "sine", frequency: 160, frequencyEnd: 110, pitchTime: 0.02, attack: 0.002, decay: 0.05, gain: 0.7, filter: { type: "lowpass", frequency: 500, q: 0.7 } }] },
    second: { id: "dome-release", name: "Dome release", note: "", layers: [{ wave: "sine", frequency: 220, frequencyEnd: 180, pitchTime: 0.02, attack: 0.002, decay: 0.03, gain: 0.35 }] },
  },
]

export const togglePairs: PatchPair[] = [
  {
    id: "two-tone",
    name: "Two-tone",
    note: "On rises 900 to 1400 Hz, off falls",
    first: { id: "two-tone-on", name: "On", note: "", layers: [
      { wave: "square", frequency: 900, attack: 0.001, decay: 0.015, gain: 0.2 },
      { wave: "square", frequency: 1400, attack: 0.001, decay: 0.02, gain: 0.2, delay: 0.035 },
    ] },
    second: { id: "two-tone-off", name: "Off", note: "", layers: [
      { wave: "square", frequency: 1400, attack: 0.001, decay: 0.015, gain: 0.2 },
      { wave: "square", frequency: 900, attack: 0.001, decay: 0.02, gain: 0.2, delay: 0.035 },
    ] },
  },
  {
    id: "latch",
    name: "Latch",
    note: "Noise snap plus a drop, lower on off",
    first: { id: "latch-on", name: "On", note: "", layers: [
      { wave: "noise", frequency: 0, attack: 0.0003, decay: 0.006, gain: 0.45, filter: { type: "highpass", frequency: 3000, q: 0.7 } },
      { wave: "sine", frequency: 300, frequencyEnd: 150, pitchTime: 0.02, attack: 0.001, decay: 0.04, gain: 0.6 },
    ] },
    second: { id: "latch-off", name: "Off", note: "", layers: [
      { wave: "noise", frequency: 0, attack: 0.0003, decay: 0.006, gain: 0.35, filter: { type: "highpass", frequency: 2200, q: 0.7 } },
      { wave: "sine", frequency: 220, frequencyEnd: 110, pitchTime: 0.02, attack: 0.001, decay: 0.04, gain: 0.6 },
    ] },
  },
  {
    id: "beeper",
    name: "1-bit beeper",
    note: "PC speaker: two pitch steps, no volume",
    first: { id: "beeper-on", name: "On", note: "", crush: { oneBit: true }, gain: 0.3, layers: [{ wave: "square", frequency: 1000, frequencyEnd: 2000, pitchTime: 0.04, pitchSteps: 2, attack: 0.0005, decay: 0.05, gain: 1 }] },
    second: { id: "beeper-off", name: "Off", note: "", crush: { oneBit: true }, gain: 0.3, layers: [{ wave: "square", frequency: 2000, frequencyEnd: 1000, pitchTime: 0.04, pitchSteps: 2, attack: 0.0005, decay: 0.05, gain: 1 }] },
  },
]

export const tickPatches: Patch[] = [
  { id: "tick-square", name: "Tick square 3k", note: "0.3 / 5 ms, ±40 cents", jitter: { cents: 40, gainDb: 1.5, decay: 0.1 }, layers: [{ wave: "square", frequency: 3000, attack: 0.0003, decay: 0.005, gain: 0.22 }] },
  { id: "tick-noise", name: "Tick noise BP", note: "Noise through 4 kHz bandpass, 4 ms", jitter: { cents: 0, gainDb: 2, decay: 0.15 }, layers: [{ wave: "noise", frequency: 0, attack: 0.0002, decay: 0.004, gain: 0.7, filter: { type: "bandpass", frequency: 4000, q: 3 } }] },
  { id: "tick-sine", name: "Tick sine 1.8k", note: "0.5 / 8 ms, glassy", jitter: { cents: 30, gainDb: 1, decay: 0.1 }, layers: [{ wave: "sine", frequency: 1800, attack: 0.0005, decay: 0.008, gain: 0.4 }] },
  { id: "tick-ratchet", name: "Ratchet", note: "Square 1.4k LP plus a 2 ms hiss", jitter: { cents: 50, gainDb: 2, decay: 0.15 }, layers: [
    { wave: "square", frequency: 1400, attack: 0.0003, decay: 0.006, gain: 0.25, filter: { type: "lowpass", frequency: 3000, q: 0.8 } },
    { wave: "noise", frequency: 0, attack: 0.0002, decay: 0.002, gain: 0.3, filter: { type: "highpass", frequency: 5000, q: 0.7 } },
  ] },
  { id: "tick-crushed", name: "Tick 8k crushed", note: "Square tick at 8 kHz, 3 bits", jitter: { cents: 40, gainDb: 1, decay: 0.1 }, crush: { sampleRate: 8000, bits: 3 }, layers: [{ wave: "square", frequency: 1500, attack: 0.0003, decay: 0.006, gain: 0.3 }] },
]

export const endStopPatch: Patch = {
  id: "end-stop",
  name: "End stop",
  note: "Sine 150 to 60 Hz plus lowpassed noise",
  layers: [
    { wave: "sine", frequency: 150, frequencyEnd: 60, pitchTime: 0.04, attack: 0.001, decay: 0.08, gain: 0.8 },
    { wave: "noise", frequency: 0, attack: 0.0003, decay: 0.015, gain: 0.4, filter: { type: "lowpass", frequency: 1200, q: 0.7 } },
  ],
}

export const retroPatches: Patch[] = [
  { id: "retro-beep", name: "1-bit beep", note: "Sign of a square: no volume, only on or off", crush: { oneBit: true }, gain: 0.25, layers: [{ wave: "square", frequency: 1000, attack: 0.0005, decay: 0.03, gain: 1 }] },
  { id: "retro-1bit-thock", name: "1-bit thock", note: "Sine drop in 4 pitch steps, then 1 bit", crush: { oneBit: true }, gain: 0.25, layers: [{ wave: "sine", frequency: 220, frequencyEnd: 80, pitchTime: 0.04, pitchSteps: 4, attack: 0.001, decay: 0.06, gain: 1 }] },
  { id: "retro-crush-thock", name: "8 kHz 4-bit thock", note: "Thock + noise held at 8 kHz, 4 bits", crush: { sampleRate: 8000, bits: 4 }, layers: thockNoise },
  { id: "retro-crush-click", name: "4 kHz 3-bit click", note: "Blend 1200 held at 4 kHz, 3 bits", crush: { sampleRate: 4000, bits: 3 }, layers: [{ wave: "blend", frequency: 1200, attack: 0.001, decay: 0.02, gain: 0.5 }] },
  { id: "retro-zap", name: "Stepped zap", note: "Square 1600 to 200 Hz in 6 steps, 4 gain steps", crush: { gainSteps: 4 }, layers: [{ wave: "square", frequency: 1600, frequencyEnd: 200, pitchTime: 0.06, pitchSteps: 6, attack: 0.001, decay: 0.07, gain: 0.2 }] },
  { id: "retro-frames", name: "50 Hz frames", note: "Pitch and gain update every 20 ms, like a chip driven by vblank", crush: { gainSteps: 4 }, layers: [{ wave: "square", frequency: 1200, frequencyEnd: 300, pitchTime: 0.08, pitchSteps: 4, attack: 0.001, decay: 0.08, gain: 0.2 }] },
  { id: "retro-stepped-gain", name: "3 gain steps", note: "Blend 900 Hz, envelope in 3 levels", crush: { gainSteps: 3 }, layers: [{ wave: "blend", frequency: 900, attack: 0.004, decay: 0.05, gain: 0.4 }] },
]

export const extraPatches: Patch[] = [
  { id: "noise-3", name: "Noise 3 ms HP", note: "Highpassed at 2 kHz: a dry snap", layers: [{ wave: "noise", frequency: 0, attack: 0.0002, decay: 0.003, gain: 0.5, filter: { type: "highpass", frequency: 2000, q: 0.7 } }] },
  { id: "noise-15", name: "Noise 15 ms LP", note: "Lowpassed at 1.5 kHz: a soft thud", layers: [{ wave: "noise", frequency: 0, attack: 0.0005, decay: 0.015, gain: 0.7, filter: { type: "lowpass", frequency: 1500, q: 0.7 } }] },
  { id: "plink", name: "Resonant plink", note: "Square 400 Hz through a Q 8 lowpass at 1.5 kHz", layers: [{ wave: "square", frequency: 400, attack: 0.0005, decay: 0.03, gain: 0.18, filter: { type: "lowpass", frequency: 1500, q: 8 } }] },
  { id: "hard-cut", name: "Hard cut (pop)", note: "Sine 300 cut at 30% with no ramp: the pop to avoid", cutAt: 0.3, layers: [{ wave: "sine", frequency: 300, attack: 0.001, decay: 0.08, gain: 0.6 }] },
]

export const allPatches: Patch[] = [
  ...wavePatches,
  ...envelopePatches,
  ...pitchPatches,
  ...thockPatches,
  ...pressReleasePairs.flatMap((pair) => [pair.first, pair.second]),
  ...togglePairs.flatMap((pair) => [pair.first, pair.second]),
  ...tickPatches,
  endStopPatch,
  ...retroPatches,
  ...extraPatches,
]
