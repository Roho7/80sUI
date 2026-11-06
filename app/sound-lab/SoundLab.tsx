"use client"

import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react"

import { Slider } from "@/components/ui/slider"
import { useSoundEnabled } from "@/hooks/use-sound"
import { soundsConfig } from "@/lib/sound/config"
import { SoundEngine } from "@/lib/sound/sound-engine"

import { ComponentBoard } from "./ComponentBoard"
import { Choice, SaveButton } from "./editors"
import { analyzeHumStops, LabAudio, type LatencyEntry, type StopAnalysis } from "./lab-audio"
import {
  allPatches,
  analyzeSamples,
  type ClickAnalysis,
  envelopePatches,
  extraPatches,
  type Patch,
  type PatchPair,
  pitchPatches,
  pressReleasePairs,
  renderPatch,
  retroPatches,
  thockPatches,
  tickPatches,
  toDecibels,
  togglePairs,
  wavePatches,
} from "./synth"
import { useSoundBank } from "./use-sound-bank"

type Trigger = "pointerdown" | "click"

const heading = "font-pixel text-[16px] uppercase"

function median(values: number[]): number {
  if (values.length === 0) {
    return Number.NaN
  }
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function percentile(values: number[], share: number): number {
  if (values.length === 0) {
    return Number.NaN
  }
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * share))]
}

function PatchButton({ patch, play, trigger }: { patch: Patch; play: (patch: Patch, eventTime: number) => void; trigger: Trigger }) {
  return (
    <button
      type="button"
      data-patch={patch.id}
      onPointerDown={(event) => {
        if (trigger === "pointerdown" && event.button === 0) {
          play(patch, event.nativeEvent.timeStamp)
        }
      }}
      onClick={(event) => {
        if (trigger === "click") {
          play(patch, event.nativeEvent.timeStamp)
        }
      }}
      className="flex min-h-20 flex-col items-start gap-1 pixel-border border-border bg-card p-2 text-left bevel-raised offset-shadow-none active:bevel-sunken"
    >
      <span className="font-pixel text-[12px] uppercase">{patch.name}</span>
      <span className="text-lg leading-tight">{patch.note}</span>
    </button>
  )
}

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className={heading}>{title}</h2>
        <p className="text-lg">{note}</p>
      </div>
      {children}
    </section>
  )
}

function PatchGrid({ patches, play, trigger }: { patches: Patch[]; play: (patch: Patch, eventTime: number) => void; trigger: Trigger }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
      {patches.map((patch) => (
        <PatchButton key={patch.id} patch={patch} play={play} trigger={trigger} />
      ))}
    </div>
  )
}

function PressKey({ pair, getAudio }: { pair: PatchPair; getAudio: () => LabAudio }) {
  const [down, setDown] = useState(false)
  return (
    <button
      type="button"
      data-pair={pair.id}
      onPointerDown={(event) => {
        setDown(true)
        getAudio().play(pair.first, { eventTime: event.nativeEvent.timeStamp, label: `${pair.name} press` })
      }}
      onPointerUp={(event) => {
        if (!down) {
          return
        }
        setDown(false)
        getAudio().play(pair.second, { eventTime: event.nativeEvent.timeStamp, label: `${pair.name} release` })
      }}
      onPointerLeave={() => setDown(false)}
      className={
        down
          ? "flex min-h-24 flex-col items-start gap-1 pixel-border border-border bg-muted p-2 text-left bevel-sunken offset-shadow-none"
          : "flex min-h-24 flex-col items-start gap-1 pixel-border border-border bg-card p-2 text-left bevel-raised offset-shadow-none"
      }
    >
      <span className="font-pixel text-[12px] uppercase">{pair.name}</span>
      <span className="text-lg leading-tight">{pair.note}. Hold, then let go.</span>
    </button>
  )
}

function ToggleKey({ pair, getAudio }: { pair: PatchPair; getAudio: () => LabAudio }) {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-pair={pair.id}
      onPointerDown={(event) => {
        const next = !on
        setOn(next)
        getAudio().play(next ? pair.first : pair.second, { eventTime: event.nativeEvent.timeStamp, label: `${pair.name} ${next ? "on" : "off"}` })
      }}
      className="flex min-h-24 flex-col items-start gap-1 pixel-border border-border bg-card p-2 text-left bevel-raised offset-shadow-none"
    >
      <span className="font-pixel text-[12px] uppercase">
        {pair.name}: {on ? "on" : "off"}
      </span>
      <span className="text-lg leading-tight">{pair.note}</span>
    </button>
  )
}

function Burst({ patch, getAudio, label }: { patch: Patch; getAudio: () => LabAudio; label: string }) {
  return (
    <button
      type="button"
      onPointerDown={() => {
        const audio = getAudio()
        const start = audio.now + 0.02
        for (let index = 0; index < 10; index += 1) {
          audio.play(patch, { when: start + index * 0.045 })
        }
      }}
      className="pixel-border border-border bg-card p-2 text-left text-lg bevel-raised offset-shadow-none"
    >
      {label}
    </button>
  )
}

export function SoundLab() {
  const audioRef = useRef<LabAudio | null>(null)
  const [ready, setReady] = useState(false)
  const [latencyHint, setLatencyHint] = useState<AudioContextLatencyCategory>("interactive")
  const [trigger, setTrigger] = useState<Trigger>("pointerdown")
  const [jitter, setJitter] = useState(true)
  const [volume, setVolume] = useState(60)
  const [view, setView] = useState<"components" | "experiments">("components")
  const [copiedAll, setCopiedAll] = useState(false)
  const soundBank = useSoundBank()
  const [componentSounds, setComponentSounds] = useSoundEnabled()

  useEffect(() => {
    const engine = SoundEngine.get()
    engine?.setOverride(soundBank.bank)
    return () => engine?.setOverride(null)
  }, [soundBank.bank])
  const [entries, setEntries] = useState<LatencyEntry[]>([])
  const [analyses, setAnalyses] = useState<{ patch: Patch; result: ClickAnalysis }[]>([])
  const [stops, setStops] = useState<StopAnalysis[]>([])
  const [sampleRate, setSampleRate] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const settings = useRef({ jitter, volume })
  useEffect(() => {
    settings.current = { jitter, volume }
  }, [jitter, volume])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => () => audioRef.current?.close(), [])

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new LabAudio(latencyHint)
      audio.jitter = settings.current.jitter
      audio.setVolume(settings.current.volume / 100)
      audio.subscribe((entry) => setEntries((current) => [entry, ...current].slice(0, 200)))
      audioRef.current = audio
      setReady(true)
      setSampleRate(audio.context.sampleRate)
      const rate = audio.context.sampleRate
      window.setTimeout(() => {
        setAnalyses(allPatches.map((patch) => ({ patch, result: analyzeSamples(renderPatch(patch, { sampleRate: rate, jitter: false }), rate) })))
        void analyzeHumStops(rate).then(setStops)
      }, 500)
    }
    return audioRef.current
  }, [latencyHint])

  const play = useCallback(
    (patch: Patch, eventTime: number) => {
      getAudio().play(patch, { eventTime })
    },
    [getAudio],
  )

  const changeHint = (hint: AudioContextLatencyCategory) => {
    audioRef.current?.close()
    audioRef.current = null
    setReady(false)
    setEntries([])
    setLatencyHint(hint)
  }

  const totals = entries.flatMap((entry) => (entry.totalMs === null ? [] : [entry.totalMs]))
  const handlers = entries.map((entry) => entry.handlerMs)
  const renders = entries.map((entry) => entry.renderMs)
  const latest = entries[0]

  return (
    <main
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-6 md:px-8"
      onPointerDownCapture={(event: ReactPointerEvent) => {
        if (event.button === 0) {
          getAudio()
        }
      }}
    >
      <header className="flex flex-col gap-4">
        <p className="font-pixel text-[16px] uppercase">UI95 / throwaway</p>
        <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">Sound lab</h1>
        <p className="max-w-3xl text-xl leading-tight">
          Every sound here is synthesized from sine, square and noise into a buffer on press: no audio files. The first press anywhere starts the AudioContext,
          because browsers block audio until a gesture.
        </p>
        <div className="grid gap-4 pixel-border border-border bg-card p-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-[12px] uppercase">Audio {ready ? `on, ${sampleRate} Hz` : "off: press anything"}</span>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={5}
              onValueChange={(next) => {
                const value = next[0] ?? 0
                setVolume(value)
                audioRef.current?.setVolume(value / 100)
              }}
            />
            <span className="text-lg">volume {volume}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-[12px] uppercase">Latency hint</span>
            <Choice options={["interactive", "balanced", "playback"] as const} value={latencyHint} onChange={changeHint} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-[12px] uppercase">Trigger buttons on</span>
            <Choice options={["pointerdown", "click"] as const} value={trigger} onChange={setTrigger} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-[12px] uppercase">Per-play variation</span>
            <Choice
              options={["on", "off"] as const}
              value={jitter ? "on" : "off"}
              onChange={(value) => {
                setJitter(value === "on")
                if (audioRef.current) {
                  audioRef.current.jitter = value === "on"
                }
              }}
            />
            <span className="text-lg">reduced motion: {reducedMotion ? "yes" : "no"}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Choice options={["components", "experiments"] as const} value={view} onChange={setView} />
        <span className="flex items-center gap-2 text-lg">
          {soundBank.editedKeys().length} edited
          <SaveButton edited={soundBank.editedKeys().length > 0} onSave={() => soundBank.save(soundBank.editedKeys())} />
        </span>
        <button
          type="button"
          className="pixel-border border-border bg-card px-2 text-lg bevel-raised offset-shadow-none"
          onClick={() => {
            void navigator.clipboard.writeText(`${JSON.stringify({ ...soundBank.bank, enabled: soundsConfig.enabled }, null, 2)}\n`).then(() => {
              setCopiedAll(true)
              window.setTimeout(() => setCopiedAll(false), 1200)
            })
          }}
        >
          {copiedAll ? "copied" : "copy as sounds.json"}
        </button>
        <button
          type="button"
          className="pixel-border border-border bg-card px-2 text-lg bevel-raised offset-shadow-none"
          onClick={() => {
            if (window.confirm("Reset every sound to its default?")) {
              soundBank.resetAll()
            }
          }}
        >
          reset all sounds
        </button>
        <button
          type="button"
          className="pixel-border border-border bg-card px-2 text-lg bevel-raised offset-shadow-none"
          onClick={() => setComponentSounds(!componentSounds)}
        >
          component sounds: {componentSounds ? "on" : "off"}
        </button>
        <span className="text-lg">The components below are the real ones, played by the shipped engine. Edits stay in this browser until you press save to sounds.json, which writes them into the repo&apos;s sounds.json (next dev only). Knobs: drag up and down (shift for fine), scroll, or arrow keys; double-click volume to reset. Releasing a knob plays the sound.</span>
      </div>

      {view === "components" ? (
        <ComponentBoard api={soundBank} />
      ) : (
        <>
      <Section title="1. Waveforms" note="Same 1200 Hz pitch and 1 / 25 ms envelope, different oscillator.">
        <PatchGrid patches={wavePatches} play={play} trigger={trigger} />
      </Section>
      <Section title="2. Envelopes" note="Attack / decay from 0.2 ms to 30 ms. Shorter reads as a tick, longer as a tone.">
        <PatchGrid patches={envelopePatches} play={play} trigger={trigger} />
      </Section>
      <Section title="3. Pitch" note="Same blend click at four pitches.">
        <PatchGrid patches={pitchPatches} play={play} trigger={trigger} />
      </Section>
      <Section title="4. Key press thocks" note="A fast exponential pitch drop is what makes a sine sound like a body being hit.">
        <PatchGrid patches={thockPatches} play={play} trigger={trigger} />
      </Section>
      <Section title="5. Press and release pairs" note="Pointer down plays the press, pointer up the release.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {pressReleasePairs.map((pair) => (
            <PressKey key={pair.id} pair={pair} getAudio={getAudio} />
          ))}
        </div>
      </Section>
      <Section title="6. Toggles" note="On and off are different sounds, so state is audible.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {togglePairs.map((pair) => (
            <ToggleKey key={pair.id} pair={pair} getAudio={getAudio} />
          ))}
        </div>
      </Section>
      <Section title="7. 1-bit and crushed" note="Stepped pitch, quantized gain, sample-and-hold rate reduction and true 1-bit output.">
        <PatchGrid patches={retroPatches} play={play} trigger={trigger} />
      </Section>
      <Section title="8. Extras" note="Noise bursts, a resonant filtered square, and the pop to avoid. The bursts fire 10 ticks 45 ms apart: toggle variation to hear the robot.">
        <PatchGrid patches={extraPatches} play={play} trigger={trigger} />
        <div className="flex flex-wrap gap-3">
          <Burst patch={tickPatches[0]} getAudio={getAudio} label="Burst x10: tick square" />
          <Burst patch={tickPatches[3]} getAudio={getAudio} label="Burst x10: ratchet" />
          <Burst patch={thockPatches[3]} getAudio={getAudio} label="Burst x10: thock + noise" />
        </div>
      </Section>

        </>
      )}

      <Section title="Latency" note="Pointer event timestamp to the moment the first sample reaches the output, from AudioContext.getOutputTimestamp().">
        <div className="flex flex-col gap-3 pixel-border border-border bg-card p-3 text-lg" data-latency>
          <p>
            samples {totals.length}, total median {median(totals).toFixed(1)} ms, p90 {percentile(totals, 0.9).toFixed(1)} ms; handler median{" "}
            {median(handlers).toFixed(2)} ms; render median {median(renders).toFixed(3)} ms; baseLatency {latest ? latest.baseMs.toFixed(1) : "-"} ms;
            outputLatency {latest ? latest.outputMs.toFixed(1) : "-"} ms
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="font-pixel text-[10px] uppercase">
                <th>#</th>
                <th>sound</th>
                <th>handler</th>
                <th>render</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 12).map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.label}</td>
                  <td>{entry.handlerMs.toFixed(2)} ms</td>
                  <td>{entry.renderMs.toFixed(3)} ms</td>
                  <td>{entry.totalMs === null ? "n/a" : `${entry.totalMs.toFixed(1)} ms`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Pops" note="Each patch rendered without variation. End is the last sample relative to peak; a pop is a large step to silence.">
        <div className="flex flex-col gap-3 pixel-border border-border bg-card p-3 text-lg" data-pops>
          <table className="w-full text-left">
            <thead>
              <tr className="font-pixel text-[10px] uppercase">
                <th>patch</th>
                <th>length</th>
                <th>peak</th>
                <th>first sample</th>
                <th>last sample</th>
                <th>max step, last 1 ms</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map(({ patch, result }) => (
                <tr key={patch.id} data-analysis={patch.id}>
                  <td>{patch.name === "On" || patch.name === "Off" ? patch.id : patch.name}</td>
                  <td>{result.durationMs.toFixed(1)} ms</td>
                  <td>{result.peak.toFixed(2)}</td>
                  <td>{toDecibels(result.startJump, result.peak)} dB</td>
                  <td>{toDecibels(result.endJump, result.peak)} dB</td>
                  <td>{toDecibels(result.tailJump, result.peak)} dB</td>
                </tr>
              ))}
              {stops.map((stop) => (
                <tr key={stop.label} data-stop>
                  <td>{stop.label}</td>
                  <td>live</td>
                  <td>{stop.peak.toFixed(2)}</td>
                  <td>steady step {toDecibels(stop.steadyJump, stop.peak)} dB</td>
                  <td>stop step {toDecibels(stop.stopJump, stop.peak)} dB</td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </main>
  )
}
