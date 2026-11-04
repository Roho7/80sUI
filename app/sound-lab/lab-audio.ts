import { type Patch, renderPatch } from "./synth"

export type LatencyEntry = {
  id: number
  label: string
  handlerMs: number
  renderMs: number
  baseMs: number
  outputMs: number
  totalMs: number | null
}

export type PlayOptions = {
  eventTime?: number
  when?: number
  label?: string
}

type Listener = (entry: LatencyEntry) => void

export class LabAudio {
  readonly context: AudioContext
  readonly master: GainNode
  jitter = true
  private nextId = 1
  private listeners = new Set<Listener>()

  constructor(latencyHint: AudioContextLatencyCategory) {
    this.context = new AudioContext({ latencyHint })
    this.master = this.context.createGain()
    this.master.gain.value = 0.6
    this.master.connect(this.context.destination)
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  setVolume(volume: number) {
    this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.005)
  }

  get now(): number {
    return this.context.currentTime
  }

  play(patch: Patch, options: PlayOptions = {}): number {
    const handlerStart = performance.now()
    if (this.context.state !== "running") {
      void this.context.resume()
    }
    const renderStart = performance.now()
    const samples = renderPatch(patch, {
      sampleRate: this.context.sampleRate,
      jitter: this.jitter,
    })
    const renderMs = performance.now() - renderStart
    const buffer = this.context.createBuffer(1, samples.length, this.context.sampleRate)
    buffer.copyToChannel(new Float32Array(samples), 0)
    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.connect(this.master)
    const when = Math.max(options.when ?? 0, this.context.currentTime)
    source.start(when)
    source.onended = () => source.disconnect()

    if (options.eventTime !== undefined && options.when === undefined) {
      this.report(patch, options, handlerStart, renderMs, when)
    }
    return when + buffer.duration
  }

  private report(patch: Patch, options: PlayOptions, handlerStart: number, renderMs: number, when: number) {
    const eventTime = options.eventTime ?? handlerStart
    const id = this.nextId
    this.nextId += 1
    const emit = (cold: boolean) => {
      const stamp = typeof this.context.getOutputTimestamp === "function" ? this.context.getOutputTimestamp() : null
      const valid = stamp !== null && (stamp.performanceTime ?? 0) > 0 && (stamp.contextTime ?? 0) > 0
      if (!valid && !cold) {
        window.setTimeout(() => emit(true), 300)
        return
      }
      const audible = valid ? (stamp.performanceTime ?? 0) + (when - (stamp.contextTime ?? 0)) * 1000 : null
      const entry: LatencyEntry = {
        id,
        label: cold ? `${options.label ?? patch.name} (cold start)` : (options.label ?? patch.name),
        handlerMs: handlerStart - eventTime,
        renderMs,
        baseMs: this.context.baseLatency * 1000,
        outputMs: (this.context.outputLatency ?? 0) * 1000,
        totalMs: audible === null ? null : audible - eventTime,
      }
      for (const listener of this.listeners) {
        listener(entry)
      }
    }
    emit(false)
  }

  close() {
    void this.context.close()
  }
}

export type StopAnalysis = { label: string; steadyJump: number; stopJump: number; peak: number }

export async function analyzeHumStops(sampleRate: number): Promise<StopAnalysis[]> {
  const results: StopAnalysis[] = []
  const stopAt = 0.2013
  for (const ramp of [0, 0.005, 0.015]) {
    const context = new OfflineAudioContext(1, Math.ceil(sampleRate * 0.4), sampleRate)
    const oscillator = context.createOscillator()
    oscillator.frequency.value = 200
    const gain = context.createGain()
    gain.gain.value = 0.3
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(0)
    if (ramp > 0) {
      gain.gain.setValueAtTime(0.3, stopAt)
      gain.gain.linearRampToValueAtTime(0, stopAt + ramp)
      oscillator.stop(stopAt + ramp + 0.005)
    } else {
      oscillator.stop(stopAt)
    }
    const rendered = await context.startRendering()
    const data = rendered.getChannelData(0)
    const readJump = (from: number, to: number) => {
      let jump = 0
      for (let index = Math.max(1, Math.floor(from * sampleRate)); index < Math.min(data.length, Math.ceil(to * sampleRate)); index += 1) {
        jump = Math.max(jump, Math.abs(data[index] - data[index - 1]))
      }
      return jump
    }
    results.push({
      label: ramp > 0 ? `Sine 200 Hz stop, ${ramp * 1000} ms gain ramp` : "Sine 200 Hz stop, hard oscillator.stop()",
      steadyJump: readJump(0.1, 0.19),
      stopJump: readJump(stopAt - 0.001, stopAt + ramp + 0.02),
      peak: 0.3,
    })
  }
  return results
}
