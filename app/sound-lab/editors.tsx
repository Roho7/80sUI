"use client"

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react"

import { DEFAULT_JITTER } from "@/lib/sound/render"
import type { SoundDetent, SoundDetentPolicy, SoundFilter, SoundLayer, SoundLoopSettings, SoundPatch, SoundWave } from "@/lib/sound/types"

import type { StepRange } from "./sound-bank"

const chip = "pixel-border border-border px-2"
const chipOn = "pixel-border border-border bg-foreground px-2 text-card"
const mini = "pixel-border border-border bg-card px-2 font-pixel text-[10px] uppercase bevel-raised offset-shadow-none active:bevel-sunken"

export function Choice<Value extends string | number>({
  options,
  value,
  onChange,
  format,
}: {
  options: readonly Value[]
  value: Value
  onChange: (value: Value) => void
  format?: (value: Value) => string
}) {
  return (
    <div className="flex flex-wrap gap-2 text-lg">
      {options.map((option) => (
        <button key={String(option)} type="button" onClick={() => onChange(option)} className={option === value ? chipOn : chip}>
          {format ? format(option) : String(option)}
        </button>
      ))}
    </div>
  )
}

export const formatHz = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(2)}k` : `${Math.round(value)}`)
export const formatSeconds = (value: number) => `${(value * 1000).toFixed(value < 0.01 ? 2 : 1)}ms`
export const formatMs = (value: number) => `${value.toFixed(value < 10 ? 1 : 0)}ms`
const formatPlain = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2))
const formatOff = (unit: string) => (value: number) => (value === 0 ? "off" : `${formatPlain(value)}${unit}`)

type KnobProps = {
  label: string
  value: number
  min: number
  max: number
  log?: boolean
  step?: number
  format?: (value: number) => string
  defaultValue?: number
  onChange: (value: number) => void
  onCommit?: () => void
}

export function SaveButton({ edited, onSave }: { edited: boolean; onSave: () => Promise<string> }) {
  const [status, setStatus] = useState("")
  return (
    <>
      <button
        type="button"
        className={mini}
        disabled={!edited}
        onClick={() => {
          setStatus("saving")
          onSave().then(setStatus, (error: unknown) => setStatus(error instanceof Error ? error.message : "save failed"))
        }}
      >
        save to sounds.json
      </button>
      {status && <span className="text-base">{status}</span>}
    </>
  )
}

const KNOB_STEPS = 16
const DRAG_PIXELS = 160

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1)
}

export function Knob(props: KnobProps) {
  const { label, value, min, max, log, format = formatPlain, defaultValue } = props
  const element = useRef<HTMLDivElement>(null)
  const latest = useRef(props)
  const drag = useRef<{ y: number; start: number; moved: boolean } | null>(null)
  const wheelTimer = useRef<number | null>(null)

  useEffect(() => {
    latest.current = props
  })

  const toNorm = (input: number) => (log ? Math.log(input / min) / Math.log(max / min) : (input - min) / (max - min))

  useEffect(() => {
    const node = element.current
    if (!node) {
      return
    }
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const current = latest.current
      const norm = current.log ? Math.log(current.value / current.min) / Math.log(current.max / current.min) : (current.value - current.min) / (current.max - current.min)
      const next = clamp01(norm - event.deltaY * (event.shiftKey ? 0.0003 : 0.0015))
      current.onChange(fromNormWith(current, next))
      if (wheelTimer.current !== null) {
        window.clearTimeout(wheelTimer.current)
      }
      wheelTimer.current = window.setTimeout(() => latest.current.onCommit?.(), 250)
    }
    node.addEventListener("wheel", onWheel, { passive: false })
    return () => node.removeEventListener("wheel", onWheel)
  }, [])

  const norm = clamp01(toNorm(value))
  const angle = -135 + (Math.round(norm * KNOB_STEPS) / KNOB_STEPS) * 270

  const nudge = (delta: number) => {
    props.onChange(fromNormWith(props, clamp01(norm + delta)))
    props.onCommit?.()
  }

  return (
    <div className="flex w-16 flex-col items-center gap-1">
      <div
        ref={element}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        className="relative size-10 cursor-ns-resize touch-none pixel-border border-border bg-secondary bevel-raised offset-shadow-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          drag.current = { y: event.clientY, start: norm, moved: false }
        }}
        onPointerMove={(event) => {
          const state = drag.current
          if (!state) {
            return
          }
          const next = clamp01(state.start + ((state.y - event.clientY) / DRAG_PIXELS) * (event.shiftKey ? 0.2 : 1))
          state.moved = true
          props.onChange(fromNormWith(props, next))
        }}
        onPointerUp={() => {
          if (drag.current?.moved) {
            props.onCommit?.()
          }
          drag.current = null
        }}
        onDoubleClick={() => {
          if (defaultValue !== undefined) {
            props.onChange(defaultValue)
            props.onCommit?.()
          }
        }}
        onKeyDown={(event: ReactKeyboardEvent) => {
          const size = event.shiftKey ? 0.1 : 0.02
          if (event.key === "ArrowUp" || event.key === "ArrowRight") {
            event.preventDefault()
            nudge(size)
          } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
            event.preventDefault()
            nudge(-size)
          }
        }}
      >
        <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="absolute top-0.5 left-1/2 h-3 w-1 -translate-x-1/2 bg-foreground" />
        </div>
      </div>
      <span className="font-pixel text-[8px] leading-none uppercase">{label}</span>
      <span className="text-base leading-none">{format(value)}</span>
    </div>
  )
}

function fromNormWith(props: Pick<KnobProps, "min" | "max" | "log" | "step">, norm: number): number {
  const raw = props.log ? props.min * Math.pow(props.max / props.min, norm) : props.min + norm * (props.max - props.min)
  if (props.step) {
    return Math.round(raw / props.step) * props.step
  }
  return Number(raw.toPrecision(3))
}

const WAVES: readonly SoundWave[] = ["sine", "square", "blend", "noise"]
const FILTERS = ["none", "lowpass", "highpass", "bandpass"] as const

function LayerEditor({
  layer,
  index,
  onChange,
  onRemove,
  onCommit,
}: {
  layer: SoundLayer
  index: number
  onChange: (layer: SoundLayer) => void
  onRemove: () => void
  onCommit: () => void
}) {
  const set = (partial: Partial<SoundLayer>) => onChange({ ...layer, ...partial })
  const setFilter = (partial: Partial<SoundFilter>) => {
    const filter = layer.filter ?? { type: "lowpass", frequency: 2000, q: 0.7 }
    set({ filter: { ...filter, ...partial } })
  }
  const tonal = layer.wave !== "noise"

  return (
    <div className="flex flex-col gap-2 pixel-border border-border bg-background p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-pixel text-[10px] uppercase">SoundLayer {index + 1}</span>
        <Choice
          options={WAVES}
          value={layer.wave}
          onChange={(wave) => {
            set({ wave, frequency: wave === "noise" ? 0 : layer.frequency || 1000 })
            onCommit()
          }}
        />
        <button type="button" className={mini} onClick={onRemove}>
          remove
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tonal && (
          <>
            <Knob label="freq" value={layer.frequency} min={40} max={12000} log format={formatHz} onChange={(frequency) => set({ frequency })} onCommit={onCommit} />
            <Knob label="end" value={layer.frequencyEnd ?? layer.frequency} min={40} max={12000} log format={formatHz} onChange={(frequencyEnd) => set({ frequencyEnd })} onCommit={onCommit} />
            <Knob label="drop" value={layer.pitchTime ?? 0} min={0} max={0.2} step={0.001} format={formatSeconds} onChange={(pitchTime) => set({ pitchTime })} onCommit={onCommit} />
            <Knob label="p.steps" value={layer.pitchSteps ?? 0} min={0} max={12} step={1} format={formatOff("")} onChange={(pitchSteps) => set({ pitchSteps: pitchSteps || undefined })} onCommit={onCommit} />
          </>
        )}
        {layer.wave === "blend" && (
          <Knob label="sine %" value={layer.sineShare ?? 0.5} min={0} max={1} step={0.05} onChange={(sineShare) => set({ sineShare })} onCommit={onCommit} />
        )}
        <Knob label="attack" value={layer.attack} min={0} max={0.02} step={0.0001} format={formatSeconds} onChange={(attack) => set({ attack })} onCommit={onCommit} />
        <Knob label="decay" value={layer.decay} min={0.001} max={0.3} log format={formatSeconds} onChange={(decay) => set({ decay })} onCommit={onCommit} />
        <Knob label="curve" value={layer.curve ?? 3} min={1} max={6} step={0.1} onChange={(curve) => set({ curve })} onCommit={onCommit} />
        <Knob label="gain" value={layer.gain} min={0} max={1} step={0.01} onChange={(gain) => set({ gain })} onCommit={onCommit} />
        <Knob label="delay" value={layer.delay ?? 0} min={0} max={0.15} step={0.001} format={formatSeconds} onChange={(delay) => set({ delay })} onCommit={onCommit} />
        {layer.filter && (
          <>
            <Knob label="cutoff" value={layer.filter.frequency} min={50} max={12000} log format={formatHz} onChange={(frequency) => setFilter({ frequency })} onCommit={onCommit} />
            <Knob label="q" value={layer.filter.q} min={0.3} max={12} log onChange={(q) => setFilter({ q })} onCommit={onCommit} />
          </>
        )}
      </div>
      <Choice
        options={FILTERS}
        value={layer.filter?.type ?? "none"}
        onChange={(type) => {
          if (type === "none") {
            set({ filter: undefined })
          } else {
            setFilter({ type })
          }
          onCommit()
        }}
      />
    </div>
  )
}

export function PatchEditor({
  soundKey,
  patch,
  edited,
  onChange,
  onAudition,
  onReset,
  onSave,
}: {
  soundKey: string
  patch: SoundPatch
  edited: boolean
  onChange: (patch: SoundPatch) => void
  onAudition: (patch: SoundPatch) => void
  onReset: () => void
  onSave: () => Promise<string>
}) {
  const latest = useRef(patch)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    latest.current = patch
  }, [patch])

  const update = (next: SoundPatch) => {
    latest.current = next
    onChange(next)
  }
  const commit = () => onAudition(latest.current)
  const jitter = patch.jitter ?? DEFAULT_JITTER
  const crush = patch.crush ?? {}

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-pixel text-[12px] uppercase">
          {soundKey}
          {edited ? " *" : ""}
        </span>
        <button type="button" className={mini} onPointerDown={(event) => event.button === 0 && onAudition(patch)}>
          play
        </button>
        <button type="button" className={mini} onClick={onReset}>
          reset
        </button>
        <SaveButton edited={edited} onSave={onSave} />
        <button
          type="button"
          className={mini}
          onClick={() => {
            void navigator.clipboard.writeText(JSON.stringify({ [soundKey]: patch }, null, 2)).then(() => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1200)
            })
          }}
        >
          {copied ? "copied" : "copy json"}
        </button>
      </div>
      {patch.note && <p className="text-lg leading-tight">{patch.note}</p>}
      <div className="flex flex-wrap gap-2">
        <Knob label="volume" value={patch.gain ?? 1} min={0} max={2} step={0.01} defaultValue={1} onChange={(gain) => update({ ...latest.current, gain })} onCommit={commit} />
        <Knob label="var ¢" value={jitter.cents} min={0} max={100} step={1} onChange={(cents) => update({ ...latest.current, jitter: { ...jitter, cents } })} onCommit={commit} />
        <Knob label="var dB" value={jitter.gainDb} min={0} max={6} step={0.1} onChange={(gainDb) => update({ ...latest.current, jitter: { ...jitter, gainDb } })} onCommit={commit} />
        <Knob label="var len" value={jitter.decay} min={0} max={0.5} step={0.01} onChange={(decay) => update({ ...latest.current, jitter: { ...jitter, decay } })} onCommit={commit} />
        <Knob label="rate" value={crush.sampleRate ?? 0} min={0} max={24000} step={500} format={(value) => (value === 0 ? "off" : formatHz(value))} onChange={(sampleRate) => update({ ...latest.current, crush: { ...crush, sampleRate: sampleRate || undefined } })} onCommit={commit} />
        <Knob label="bits" value={crush.bits ?? 0} min={0} max={8} step={1} format={formatOff("")} onChange={(bits) => update({ ...latest.current, crush: { ...crush, bits: bits || undefined } })} onCommit={commit} />
        <Knob label="g.steps" value={crush.gainSteps ?? 0} min={0} max={8} step={1} format={formatOff("")} onChange={(gainSteps) => update({ ...latest.current, crush: { ...crush, gainSteps: gainSteps || undefined } })} onCommit={commit} />
        <div className="flex flex-col items-center gap-1">
          <span className="font-pixel text-[8px] uppercase">1-bit</span>
          <Choice
            options={["off", "on"] as const}
            value={crush.oneBit ? "on" : "off"}
            onChange={(value) => {
              update({ ...latest.current, crush: { ...crush, oneBit: value === "on" || undefined } })
              commit()
            }}
          />
        </div>
      </div>
      {patch.layers.map((layer, index) => (
        <LayerEditor
          key={index}
          layer={layer}
          index={index}
          onCommit={commit}
          onChange={(next) => update({ ...latest.current, layers: latest.current.layers.map((item, position) => (position === index ? next : item)) })}
          onRemove={() => update({ ...latest.current, layers: latest.current.layers.filter((_, position) => position !== index) })}
        />
      ))}
      <div>
        <button
          type="button"
          className={mini}
          onClick={() => update({ ...latest.current, layers: [...latest.current.layers, { wave: "sine", frequency: 1000, attack: 0.0005, decay: 0.01, gain: 0.2 }] })}
        >
          add layer
        </button>
      </div>
    </div>
  )
}

export function LoopEditor({
  hum,
  edited,
  onChange,
  onReset,
  onSave,
}: {
  hum: SoundLoopSettings
  edited: boolean
  onChange: (hum: SoundLoopSettings) => void
  onReset: () => void
  onSave: () => Promise<string>
}) {
  const set = (partial: Partial<SoundLoopSettings>) => onChange({ ...hum, ...partial })
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-pixel text-[12px] uppercase">Friction{edited ? " *" : ""}</span>
        <button type="button" className={mini} onClick={onReset}>
          reset
        </button>
        <SaveButton edited={edited} onSave={onSave} />
      </div>
      <p className="text-lg leading-tight">A live source through a filter. Speed opens the filter and the level; both update at the stepped rate. Scrub the pad to hear it.</p>
      <div className="flex flex-wrap items-center gap-3">
        <Choice options={["noise", "square", "sine"] as const} value={hum.source} onChange={(source) => set({ source })} />
        <Choice options={["bandpass", "lowpass", "highpass"] as const} value={hum.filter} onChange={(filter) => set({ filter })} />
      </div>
      <div className="flex flex-wrap gap-2">
        {hum.source !== "noise" && <Knob label="osc" value={hum.frequency} min={20} max={2000} log format={formatHz} onChange={(frequency) => set({ frequency })} />}
        <Knob label="f slow" value={hum.filterLow} min={50} max={12000} log format={formatHz} onChange={(filterLow) => set({ filterLow })} />
        <Knob label="f fast" value={hum.filterHigh} min={50} max={12000} log format={formatHz} onChange={(filterHigh) => set({ filterHigh })} />
        <Knob label="q" value={hum.q} min={0.3} max={12} log onChange={(q) => set({ q })} />
        <Knob label="lvl slow" value={hum.levelMin} min={0} max={1} step={0.01} onChange={(levelMin) => set({ levelMin })} />
        <Knob label="lvl fast" value={hum.levelMax} min={0} max={1} step={0.01} onChange={(levelMax) => set({ levelMax })} />
        <Knob label="full px/s" value={hum.fullSpeed} min={100} max={5000} log format={(value) => String(Math.round(value))} onChange={(fullSpeed) => set({ fullSpeed })} />
        <Knob label="gate px/s" value={hum.gate} min={0} max={300} step={5} onChange={(gate) => set({ gate })} />
        <Knob label="fps" value={hum.fps} min={2} max={60} step={1} onChange={(fps) => set({ fps })} />
        <Knob label="smooth" value={hum.smoothing} min={0.5} max={50} log format={formatMs} onChange={(smoothing) => set({ smoothing })} />
        <Knob label="stop" value={hum.stopRamp} min={1} max={100} log format={formatMs} onChange={(stopRamp) => set({ stopRamp })} />
      </div>
    </div>
  )
}

const POLICIES: readonly SoundDetentPolicy[] = ["spread", "collapse", "per-event"]

export function DetentEditor({
  ticker,
  onSave,
  range,
  edited,
  onChange,
  onReset,
}: {
  ticker: SoundDetent
  onSave: () => Promise<string>
  range: StepRange
  edited: boolean
  onChange: (ticker: SoundDetent) => void
  onReset: () => void
}) {
  const set = (partial: Partial<SoundDetent>) => onChange({ ...ticker, ...partial })
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-pixel text-[12px] uppercase">Detent{edited ? " *" : ""}</span>
        <button type="button" className={mini} onClick={onReset}>
          reset
        </button>
        <SaveButton edited={edited} onSave={onSave} />
      </div>
      <p className="text-lg leading-tight">
        One tick per step crossed. When one pointer event crosses several steps: spread plays them gap apart (never more than max ahead), collapse plays one, per-event ignores steps.
      </p>
      <Choice options={POLICIES} value={ticker.policy} onChange={(policy) => set({ policy })} />
      <div className="flex flex-wrap gap-2">
        <Knob label={`step ${range.unit}`} value={ticker.step} min={range.min} max={range.max} step={1} onChange={(step) => set({ step })} />
        <Knob label="gap" value={ticker.minGap} min={0} max={80} step={1} format={formatMs} onChange={(minGap) => set({ minGap })} />
        <Knob label="max ahead" value={ticker.maxAhead} min={0} max={200} step={5} format={formatMs} onChange={(maxAhead) => set({ maxAhead })} />
        <Knob label="pitch ±" value={ticker.pitchFollow} min={0} max={0.5} step={0.01} format={(value) => (value === 0 ? "off" : `${Math.round(value * 100)}%`)} onChange={(pitchFollow) => set({ pitchFollow })} />
      </div>
    </div>
  )
}
