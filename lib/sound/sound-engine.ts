import { renderSoundPatch } from "./render"
import {
  isSoundLoop,
  isSoundPatch,
  type SoundDetent,
  type SoundLoopSettings,
  type SoundPatch,
  type SoundsConfig,
} from "./types"

export type SoundPlayOptions = { when?: number; rate?: number }

const ENABLED_KEY = "nostalgui:sound-enabled"
const VARIANTS = 6
const MAX_VOICES = 12
const DEFAULT_VOLUME = 0.6
const DEFAULT_DETENT: SoundDetent = { step: 1, minGap: 18, maxAhead: 60, policy: "spread", pitchFollow: 0 }
const EMPTY_CONFIG: SoundsConfig = { sounds: {} }

function readStoredEnabled(): boolean | null {
  try {
    const stored = window.localStorage.getItem(ENABLED_KEY)
    return stored === null ? null : stored === "true"
  } catch {
    return null
  }
}

export class SoundLoopHandle {
  private gain: GainNode
  private filter: BiquadFilterNode
  private source: AudioScheduledSourceNode
  private distance = 0
  private timer: number
  private stopped = false

  constructor(
    private context: AudioContext,
    destination: AudioNode,
    private settings: SoundLoopSettings,
    noise: AudioBuffer,
  ) {
    this.gain = context.createGain()
    this.gain.gain.value = 0
    this.filter = context.createBiquadFilter()
    this.filter.type = settings.filter
    this.filter.frequency.value = settings.filterLow
    this.filter.Q.value = settings.q
    this.filter.connect(this.gain)
    this.gain.connect(destination)
    if (settings.source === "noise") {
      const source = context.createBufferSource()
      source.buffer = noise
      source.loop = true
      this.source = source
    } else {
      const oscillator = context.createOscillator()
      oscillator.type = settings.source
      oscillator.frequency.value = settings.frequency
      this.source = oscillator
    }
    this.source.connect(this.filter)
    this.source.start()
    const fps = Math.max(settings.fps, 1)
    this.timer = window.setInterval(() => {
      this.setSpeed(this.distance * fps)
      this.distance = 0
    }, 1000 / fps)
  }

  move(pixels: number) {
    this.distance += pixels
  }

  private setSpeed(speed: number) {
    const settings = this.settings
    const now = this.context.currentTime
    const amount = Math.min(speed / Math.max(settings.fullSpeed, 1), 1)
    const level = speed < settings.gate ? 0 : settings.levelMin + amount * (settings.levelMax - settings.levelMin)
    this.gain.gain.setTargetAtTime(level, now, Math.max(settings.smoothing, 0.5) / 1000)
    this.filter.frequency.setValueAtTime(settings.filterLow + amount * (settings.filterHigh - settings.filterLow), now)
  }

  stop() {
    if (this.stopped) {
      return
    }
    this.stopped = true
    window.clearInterval(this.timer)
    const ramp = Math.max(this.settings.stopRamp, 1) / 1000
    const now = this.context.currentTime
    this.gain.gain.cancelScheduledValues(now)
    this.gain.gain.setValueAtTime(this.gain.gain.value, now)
    this.gain.gain.linearRampToValueAtTime(0, now + ramp)
    this.source.stop(now + ramp + 0.005)
    this.source.onended = () => {
      this.source.disconnect()
      this.filter.disconnect()
      this.gain.disconnect()
    }
  }
}

export class SoundEngine {
  private static instance: SoundEngine | null = null

  static get(): SoundEngine | null {
    if (typeof window === "undefined" || typeof window.AudioContext === "undefined") {
      return null
    }
    SoundEngine.instance ??= new SoundEngine()
    return SoundEngine.instance
  }

  private base: SoundsConfig = EMPTY_CONFIG
  private override: SoundsConfig | null = null
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private variants = new Map<string, { buffers: AudioBuffer[]; next: number }>()
  private nextTick = new Map<string, number>()
  private storedEnabled: boolean | null = readStoredEnabled()
  private listeners = new Set<() => void>()
  private warned = new Set<string>()
  private voices = 0
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  get config(): SoundsConfig {
    return this.override ?? this.base
  }

  get enabled(): boolean {
    const muted = this.reducedMotion.matches && this.config.reducedMotion === "mute"
    return !muted && (this.storedEnabled ?? this.config.enabled !== false)
  }

  configure(config: SoundsConfig) {
    this.base = config
    this.refresh()
  }

  setOverride(config: SoundsConfig | null) {
    this.override = config
    this.refresh()
  }

  setEnabled(enabled: boolean) {
    this.storedEnabled = enabled
    try {
      window.localStorage.setItem(ENABLED_KEY, String(enabled))
    } catch {
      this.warned.add(ENABLED_KEY)
    }
    if (enabled) {
      this.unlock()
    }
    this.notify()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  unlock(): AudioContext | null {
    if (!this.enabled) {
      return null
    }
    if (!this.context) {
      const context = new AudioContext({ latencyHint: "interactive" })
      const master = context.createGain()
      master.gain.value = this.config.volume ?? DEFAULT_VOLUME
      master.connect(context.destination)
      const noise = context.createBuffer(1, context.sampleRate, context.sampleRate)
      const channel = noise.getChannelData(0)
      for (let index = 0; index < channel.length; index += 1) {
        channel[index] = Math.random() * 2 - 1
      }
      this.context = context
      this.master = master
      this.noise = noise
    }
    if (this.context.state === "suspended") {
      void this.context.resume()
    }
    return this.context
  }

  get now(): number {
    return this.context?.currentTime ?? 0
  }

  has(key: string): boolean {
    const entry = this.config.sounds[key]
    return entry !== undefined && entry !== false
  }

  detent(key: string): SoundDetent {
    const entry = this.config.sounds[key]
    return isSoundPatch(entry) && entry.detent ? entry.detent : DEFAULT_DETENT
  }

  play(key: string, options: SoundPlayOptions = {}): boolean {
    const entry = this.config.sounds[key]
    if (!isSoundPatch(entry)) {
      this.warnMissing(key, entry === undefined)
      return false
    }
    const context = this.unlock()
    if (!context) {
      return false
    }
    const buffer = this.readVariant(key, context)
    return buffer ? this.start(context, buffer, options) : false
  }

  playPatch(patch: SoundPatch, options: SoundPlayOptions = {}): boolean {
    const context = this.unlock()
    if (!context) {
      return false
    }
    return this.start(context, this.toBuffer(context, patch), options)
  }

  private start(context: AudioContext, buffer: AudioBuffer, options: SoundPlayOptions): boolean {
    if (!this.master || this.voices >= MAX_VOICES) {
      return false
    }
    const source = context.createBufferSource()
    source.buffer = buffer
    source.playbackRate.value = options.rate ?? 1
    source.connect(this.master)
    source.start(Math.max(options.when ?? 0, context.currentTime))
    this.voices += 1
    source.onended = () => {
      this.voices -= 1
      source.disconnect()
    }
    return true
  }

  private toBuffer(context: AudioContext, patch: SoundPatch): AudioBuffer {
    const samples = renderSoundPatch(patch, { sampleRate: context.sampleRate, jitter: true })
    const buffer = context.createBuffer(1, samples.length, context.sampleRate)
    buffer.copyToChannel(new Float32Array(samples), 0)
    return buffer
  }

  step(key: string, steps: number, position = 0.5) {
    if (steps <= 0 || !this.enabled) {
      return
    }
    const thin = this.isThin()
    const detent = this.detent(key)
    const policy = thin ? "collapse" : detent.policy
    const gap = (thin ? Math.max(detent.minGap, 60) : detent.minGap) / 1000
    const rate = 1 + (position * 2 - 1) * detent.pitchFollow
    const context = this.unlock()
    if (!context) {
      return
    }
    const now = context.currentTime
    const free = this.nextTick.get(key) ?? 0
    if (policy === "per-event") {
      this.play(key, { rate })
      return
    }
    if (policy === "collapse") {
      if (now >= free - gap * 0.5 && this.play(key, { rate })) {
        this.nextTick.set(key, now + gap)
      }
      return
    }
    let when = Math.max(now, free)
    for (let index = 0; index < steps && when <= now + detent.maxAhead / 1000; index += 1) {
      this.play(key, { when, rate })
      when += gap
    }
    this.nextTick.set(key, when)
  }

  startLoop(key: string): SoundLoopHandle | null {
    const entry = this.config.sounds[key]
    if (!isSoundLoop(entry)) {
      this.warnMissing(key, entry === undefined)
      return null
    }
    if (this.isThin()) {
      return null
    }
    const context = this.unlock()
    if (!context || !this.master || !this.noise) {
      return null
    }
    return new SoundLoopHandle(context, this.master, entry.loop, this.noise)
  }

  private isThin(): boolean {
    return this.reducedMotion.matches && (this.config.reducedMotion ?? "thin") === "thin"
  }

  private readVariant(key: string, context: AudioContext): AudioBuffer | null {
    const entry = this.config.sounds[key]
    if (!isSoundPatch(entry)) {
      return null
    }
    let cached = this.variants.get(key)
    if (!cached) {
      const buffers = Array.from({ length: VARIANTS }, () => this.toBuffer(context, entry))
      cached = { buffers, next: Math.floor(Math.random() * VARIANTS) }
      this.variants.set(key, cached)
    }
    const buffer = cached.buffers[cached.next % cached.buffers.length]
    cached.next += 1 + Math.floor(Math.random() * (VARIANTS - 1))
    return buffer
  }

  private warnMissing(key: string, missing: boolean) {
    if (!missing || this.warned.has(key) || process.env.NODE_ENV === "production") {
      return
    }
    this.warned.add(key)
    console.warn(`NOSTALGUI sound "${key}" is not in sounds.json. Run: node scripts/dither-sounds.mjs sync`)
  }

  private refresh() {
    this.variants.clear()
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(this.config.volume ?? DEFAULT_VOLUME, this.context.currentTime, 0.01)
    }
    this.notify()
  }

  private notify() {
    for (const listener of this.listeners) {
      listener()
    }
  }
}
