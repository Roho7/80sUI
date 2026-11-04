import type { SoundFilter, SoundJitter, SoundLayer, SoundPatch } from "./types"

export type RenderOptions = {
  sampleRate: number
  jitter: boolean
  random?: () => number
}

export const DEFAULT_JITTER: SoundJitter = { cents: 35, gainDb: 1.5, decay: 0.12 }

const TAIL_SECONDS = 0.006
const GUARD_SECONDS = 0.001

type Biquad = { b0: number; b1: number; b2: number; a1: number; a2: number }

function designBiquad(spec: SoundFilter, sampleRate: number): Biquad {
  const omega = (2 * Math.PI * Math.min(spec.frequency, sampleRate * 0.45)) / sampleRate
  const cos = Math.cos(omega)
  const alpha = Math.sin(omega) / (2 * spec.q)
  const a0 = 1 + alpha
  const feedback = { a1: (-2 * cos) / a0, a2: (1 - alpha) / a0 }
  if (spec.type === "lowpass") {
    return { b0: (1 - cos) / 2 / a0, b1: (1 - cos) / a0, b2: (1 - cos) / 2 / a0, ...feedback }
  }
  if (spec.type === "highpass") {
    return { b0: (1 + cos) / 2 / a0, b1: -(1 + cos) / a0, b2: (1 + cos) / 2 / a0, ...feedback }
  }
  return { b0: alpha / a0, b1: 0, b2: -alpha / a0, ...feedback }
}

function applyBiquad(samples: Float32Array, start: number, end: number, filter: Biquad) {
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  for (let index = start; index < end; index += 1) {
    const x0 = samples[index]
    const y0 = filter.b0 * x0 + filter.b1 * x1 + filter.b2 * x2 - filter.a1 * y1 - filter.a2 * y2
    samples[index] = y0
    x2 = x1
    x1 = x0
    y2 = y1
    y1 = y0
  }
}

function readFrequency(layer: SoundLayer, time: number, scale: number): number {
  const start = layer.frequency * scale
  const end = (layer.frequencyEnd ?? layer.frequency) * scale
  const pitchTime = layer.pitchTime ?? 0
  if (pitchTime <= 0 || start === end) {
    return start
  }
  const progress = Math.min(time / pitchTime, 1)
  const stepped = layer.pitchSteps ? Math.floor(progress * layer.pitchSteps) / layer.pitchSteps : progress
  return start * Math.pow(end / start, stepped)
}

function readEnvelope(layer: SoundLayer, time: number, gainSteps: number | undefined): number {
  const attack = Math.max(layer.attack, 0)
  let level: number
  if (time < attack) {
    level = time / attack
  } else {
    const progress = (time - attack) / layer.decay
    level = progress >= 1 ? 0 : Math.pow(1 - progress, layer.curve ?? 3)
  }
  if (gainSteps) {
    return Math.ceil(level * gainSteps - 1e-9) / gainSteps
  }
  return level
}

function readOscillator(layer: SoundLayer, phase: number, random: () => number): number {
  if (layer.wave === "noise") {
    return random() * 2 - 1
  }
  const sine = Math.sin(2 * Math.PI * phase)
  if (layer.wave === "sine") {
    return sine
  }
  const square = phase % 1 < 0.5 ? 1 : -1
  if (layer.wave === "square") {
    return square
  }
  const share = layer.sineShare ?? 0.5
  return sine * share + square * (1 - share)
}

function readLength(layer: SoundLayer): number {
  return (layer.delay ?? 0) + Math.max(layer.attack, 0) + layer.decay + (layer.filter ? TAIL_SECONDS : 0)
}

export function readPatchDuration(patch: SoundPatch): number {
  return Math.max(0, ...patch.layers.map(readLength)) + GUARD_SECONDS
}

export function renderSoundPatch(patch: SoundPatch, options: RenderOptions): Float32Array {
  const random = options.random ?? Math.random
  const jitter = options.jitter ? (patch.jitter ?? DEFAULT_JITTER) : null
  const centsShift = jitter ? (random() * 2 - 1) * jitter.cents : 0
  const gainShift = jitter ? Math.pow(10, ((random() * 2 - 1) * jitter.gainDb) / 20) : 1
  const decayShift = jitter ? 1 + (random() * 2 - 1) * jitter.decay : 1
  const frequencyScale = Math.pow(2, centsShift / 1200)
  const sampleRate = options.sampleRate
  const length = Math.max(1, Math.ceil(readPatchDuration(patch) * sampleRate))
  const output = new Float32Array(length)
  const scratch = new Float32Array(length)
  const crush = patch.crush

  for (const sourceLayer of patch.layers) {
    const layer = { ...sourceLayer, decay: Math.max(sourceLayer.decay * decayShift, 1e-4) }
    const offset = Math.round((layer.delay ?? 0) * sampleRate)
    const layerLength = Math.min(Math.ceil(readLength(layer) * sampleRate), length - offset)
    const voiced = Math.ceil((Math.max(layer.attack, 0) + layer.decay) * sampleRate)
    scratch.fill(0)
    let phase = 0
    for (let index = 0; index < Math.min(layerLength, voiced); index += 1) {
      const time = index / sampleRate
      phase += readFrequency(layer, time, frequencyScale) / sampleRate
      scratch[offset + index] = readOscillator(layer, phase, random) * readEnvelope(layer, time, crush?.gainSteps) * layer.gain
    }
    if (layer.filter) {
      applyBiquad(scratch, offset, offset + layerLength, designBiquad(layer.filter, sampleRate))
    }
    for (let index = offset; index < offset + layerLength; index += 1) {
      output[index] += scratch[index]
    }
  }

  if (crush?.sampleRate) {
    const hold = sampleRate / crush.sampleRate
    let held = 0
    let counter = hold
    for (let index = 0; index < length; index += 1) {
      if (counter >= hold) {
        held = output[index]
        counter -= hold
      }
      output[index] = held
      counter += 1
    }
  }
  if (crush?.bits) {
    const levels = Math.pow(2, crush.bits - 1)
    for (let index = 0; index < length; index += 1) {
      output[index] = Math.round(output[index] * levels) / levels
    }
  }
  if (crush?.oneBit) {
    for (let index = 0; index < length; index += 1) {
      const value = output[index]
      output[index] = Math.abs(value) < 0.04 ? 0 : Math.sign(value) * 0.5
    }
  }

  const patchGain = (patch.gain ?? 1) * gainShift
  const guard = Math.min(Math.ceil(GUARD_SECONDS * sampleRate), length)
  for (let index = 0; index < length; index += 1) {
    const fromEnd = length - 1 - index
    output[index] *= patchGain * (fromEnd < guard ? fromEnd / guard : 1)
  }
  return output
}
