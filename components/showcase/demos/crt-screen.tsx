"use client"

import { useState } from "react"

import { CrtScreen } from "@/components/retro/crt-screen"
import { Terminal, type TerminalLine } from "@/components/retro/terminal"
import { Window } from "@/components/retro/window"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { CrtParams, CrtPresetName } from "@/lib/shaders/crt"

import type { ShowcaseDemo } from "../types"

const LINES: readonly TerminalLine[] = [
  { kind: "command", text: "ver" },
  { kind: "output", text: "UI95 [Version 0.0.1]" },
  { kind: "command", text: "dir" },
  { kind: "output", text: "3 file(s)  640 bytes" },
]

type SliderKey = "scanlines" | "noise" | "vignette" | "mask" | "bloom" | "curvature" | "aberration"

const SLIDERS: readonly { key: SliderKey; max: number; step: number }[] = [
  { key: "scanlines", max: 1, step: 0.05 },
  { key: "noise", max: 1, step: 0.01 },
  { key: "vignette", max: 1, step: 0.05 },
  { key: "mask", max: 1, step: 0.05 },
  { key: "bloom", max: 1, step: 0.05 },
  { key: "curvature", max: 1, step: 0.05 },
  { key: "aberration", max: 4, step: 0.1 },
]

function PresetScreen({ preset }: { preset: CrtPresetName }) {
  return (
    <CrtScreen preset={preset} className="w-full">
      <div className="bg-desktop p-6">
        <Window title="Notes.txt" statusBar={<span>Ln 1, Col 1</span>}>
          <p className="p-3 text-xl">Buy floppies. Defrag on Sunday.</p>
        </Window>
      </div>
    </CrtScreen>
  )
}

function ControlsScreen() {
  const [values, setValues] = useState<Pick<CrtParams, SliderKey>>({
    scanlines: 0.18,
    noise: 0.08,
    vignette: 0.25,
    mask: 0.1,
    bloom: 0.15,
    curvature: 0.15,
    aberration: 0,
  })
  const [roll, setRoll] = useState(false)
  const [flicker, setFlicker] = useState(false)

  return (
    <div className="flex w-full flex-col gap-4">
      <CrtScreen {...values} roll={roll} flicker={flicker ? 0.5 : 0} className="w-full min-w-0">
        <div className="bg-desktop p-12">
          <Window title="script.bash  ">
            <Terminal lines={LINES} isLooping className="h-60" />
          </Window>
        </div>
      </CrtScreen>
      <div className="flex w-full flex-col gap-3">
        {SLIDERS.map(({ key, max, step }) => (
          <div key={key} className="flex flex-col gap-1">
            <Label className="justify-between">
              <span>{key}</span>
              <span>{values[key]}</span>
            </Label>
            <Slider
              aria-label={key}
              min={0}
              max={max}
              step={step}
              value={[values[key]]}
              onValueChange={([next]) => setValues((previous) => ({ ...previous, [key]: next }))}
            />
          </div>
        ))}
        <Label>
          <Switch aria-label="roll" checked={roll} onCheckedChange={setRoll} />
          roll
        </Label>
        <Label>
          <Switch aria-label="flicker" checked={flicker} onCheckedChange={setFlicker} />
          flicker
        </Label>
      </div>
    </div>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variantLayout: "stack",
  variants: [
    { label: "subtle", render: () => <PresetScreen preset="subtle" /> },
    { label: "arcade", render: () => <PresetScreen preset="arcade" /> },
    { label: "broken", render: () => <PresetScreen preset="broken" /> },
    { label: "controls", render: () => <ControlsScreen /> },
  ],
}
