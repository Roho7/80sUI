export type SoundWave = "sine" | "square" | "blend" | "noise"

export type SoundFilter = {
  type: "lowpass" | "highpass" | "bandpass"
  frequency: number
  q: number
}

export type SoundLayer = {
  wave: SoundWave
  frequency: number
  frequencyEnd?: number
  pitchTime?: number
  pitchSteps?: number
  sineShare?: number
  attack: number
  decay: number
  curve?: number
  gain: number
  delay?: number
  filter?: SoundFilter
}

export type SoundCrush = {
  sampleRate?: number
  bits?: number
  gainSteps?: number
  oneBit?: boolean
}

export type SoundJitter = { cents: number; gainDb: number; decay: number }

export type SoundDetentPolicy = "spread" | "collapse" | "per-event"

export type SoundDetent = {
  step: number
  minGap: number
  maxAhead: number
  policy: SoundDetentPolicy
  pitchFollow: number
}

export type SoundPatch = {
  note?: string
  layers: SoundLayer[]
  crush?: SoundCrush
  jitter?: SoundJitter
  gain?: number
  detent?: SoundDetent
}

export type SoundLoopSettings = {
  source: "noise" | "square" | "sine"
  frequency: number
  filter: "lowpass" | "bandpass" | "highpass"
  filterLow: number
  filterHigh: number
  q: number
  levelMin: number
  levelMax: number
  fullSpeed: number
  gate: number
  fps: number
  smoothing: number
  stopRamp: number
}

export type SoundLoop = { note?: string; loop: SoundLoopSettings }

export type SoundEntry = SoundPatch | SoundLoop | false

export type SoundsConfig = {
  $schema?: string
  enabled?: boolean
  volume?: number
  reducedMotion?: "thin" | "mute" | "ignore"
  sounds: Record<string, SoundEntry>
}

export function isSoundLoop(entry: SoundEntry | undefined): entry is SoundLoop {
  return typeof entry === "object" && "loop" in entry
}

export function isSoundPatch(entry: SoundEntry | undefined): entry is SoundPatch {
  return typeof entry === "object" && "layers" in entry
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function readSoundsConfig(value: unknown): SoundsConfig {
  if (!isRecord(value) || !isRecord(value.sounds)) {
    throw new Error("sounds.json needs a \"sounds\" object")
  }
  for (const [key, entry] of Object.entries(value.sounds)) {
    if (entry === false) {
      continue
    }
    if (!isRecord(entry) || (!Array.isArray(entry.layers) && !isRecord(entry.loop))) {
      throw new Error(`sounds.json "${key}" needs "layers", "loop" or false`)
    }
  }
  return value as SoundsConfig
}
