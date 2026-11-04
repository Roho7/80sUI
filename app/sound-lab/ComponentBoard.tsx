"use client"

import { type ReactNode, useState } from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CtaButton } from "@/components/ui/cta-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SoundEngine } from "@/lib/sound/sound-engine"
import { isSoundLoop, isSoundPatch, type SoundDetent, type SoundPatch } from "@/lib/sound/types"

import { DialDemo, LeverDemo, PadDemo } from "./DragControls"
import { DetentEditor, LoopEditor, PatchEditor } from "./editors"
import { boardEntries,type BoardEntry } from "./sound-bank"
import type { SoundBankApi } from "./use-sound-bank"

const DEFAULT_DETENT: SoundDetent = { step: 1, minGap: 18, maxAhead: 60, policy: "spread", pitchFollow: 0 }

function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-2">
      {["Snap to grid", "Show hidden files", "Dither wallpaper"].map((text, index) => (
        <Label key={text} className="flex items-center gap-2 text-lg">
          <Checkbox defaultChecked={index === 0} />
          {text}
        </Label>
      ))}
    </div>
  )
}

function RadioDemo() {
  return (
    <RadioGroup defaultValue="phosphor">
      {["phosphor", "cyan-pixel", "amber"].map((option) => (
        <Label key={option} className="flex items-center gap-2 text-lg">
          <RadioGroupItem value={option} />
          {option}
        </Label>
      ))}
    </RadioGroup>
  )
}

function SwitchDemo() {
  return (
    <div className="flex flex-col gap-3">
      {["Sound", "Screensaver"].map((text, index) => (
        <Label key={text} className="flex items-center gap-3 text-lg">
          <Switch defaultChecked={index === 1} />
          {text}
        </Label>
      ))}
    </div>
  )
}

function SliderDemo() {
  const [value, setValue] = useState(50)
  return (
    <div className="flex flex-col gap-3">
      <Slider value={[value]} min={0} max={100} step={1} onValueChange={(next) => setValue(next[0] ?? 0)} />
      <p className="text-lg">value {value}</p>
    </div>
  )
}

function demoFor(entry: BoardEntry, detentStep: number): ReactNode {
  switch (entry.id) {
    case "button":
      return (
        <div className="flex flex-wrap gap-3">
          <Button>OK</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      )
    case "small-button":
      return (
        <div className="flex flex-wrap gap-2">
          {["_", "□", "x"].map((glyph) => (
            <Button key={glyph} size="icon-sm" aria-label={glyph}>
              {glyph}
            </Button>
          ))}
          <Button size="xs">apply</Button>
        </div>
      )
    case "keycap":
      return <CtaButton>Start</CtaButton>
    case "tabs":
      return (
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">General</TabsTrigger>
            <TabsTrigger value="two">Display</TabsTrigger>
            <TabsTrigger value="three">Sound</TabsTrigger>
          </TabsList>
        </Tabs>
      )
    case "menu":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["New", "Open", "Save", "Exit"].map((item) => (
              <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    case "checkbox":
      return <CheckboxDemo />
    case "radio":
      return <RadioDemo />
    case "switch":
      return <SwitchDemo />
    case "toggle":
      return (
        <div className="flex flex-col gap-3">
          <Toggle aria-label="Bold">B</Toggle>
          <ToggleGroup type="multiple" aria-label="Style">
            <ToggleGroupItem value="bold">B</ToggleGroupItem>
            <ToggleGroupItem value="italic">I</ToggleGroupItem>
            <ToggleGroupItem value="underline">U</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="left" aria-label="Align">
            <ToggleGroupItem value="left">L</ToggleGroupItem>
            <ToggleGroupItem value="center">C</ToggleGroupItem>
            <ToggleGroupItem value="right">R</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )
    case "slider":
      return <SliderDemo />
    case "drag":
      return (
        <div className="relative h-48 overflow-hidden">
          <Window title="Drag me" defaultPosition={{ x: 8, y: 8 }} className="w-56">
            <p className="p-3 text-lg">Grab the title bar.</p>
          </Window>
        </div>
      )
    case "pad":
      return <PadDemo stepPx={detentStep} />
    case "dial":
      return <DialDemo detentSize={detentStep} />
    case "lever":
      return <LeverDemo notches={detentStep} />
    default:
      return null
  }
}

type EditorTab = { id: string; label: string; render: () => ReactNode }

function Card({ entry, demo, tabs }: { entry: BoardEntry; demo: ReactNode; tabs: EditorTab[] }) {
  const [open, setOpen] = useState(tabs[0]?.id ?? "")
  const active = tabs.find((tab) => tab.id === open)
  return (
    <section data-board={entry.id} className="grid gap-4 pixel-border border-border bg-card p-3 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-3">
        <h3 className="font-pixel text-[14px] uppercase">{entry.name}</h3>
        <p className="text-lg leading-tight">{entry.note}</p>
        <div className="pixel-border border-border bg-background p-3">{demo}</div>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-sound="none"
              onClick={() => setOpen(open === tab.id ? "" : tab.id)}
              className={tab.id === open ? "pixel-border border-border bg-foreground px-2 text-card" : "pixel-border border-border px-2"}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {active?.render()}
      </div>
    </section>
  )
}

export function ComponentBoard({ api }: { api: SoundBankApi }) {
  const { bank } = api
  const audition = (patch: SoundPatch) => SoundEngine.get()?.playPatch(patch)
  const mark = (key: string) => (api.isEdited(key) ? " *" : "")

  const tabsFor = (entry: BoardEntry): EditorTab[] => {
    const tabs: EditorTab[] = []
    const loopKey = entry.loop
    const loop = loopKey ? bank.sounds[loopKey] : undefined
    if (loopKey && isSoundLoop(loop)) {
      tabs.push({
        id: loopKey,
        label: `friction${mark(loopKey)}`,
        render: () => (
          <LoopEditor hum={loop.loop} edited={api.isEdited(loopKey)} onChange={(next) => api.setSound(loopKey, { ...loop, loop: next })} onReset={() => api.resetSound(loopKey)} onSave={() => api.save([loopKey])} />
        ),
      })
    }
    for (const { key, label } of entry.sounds) {
      const patch = bank.sounds[key]
      if (!isSoundPatch(patch)) {
        continue
      }
      tabs.push({
        id: key,
        label: `${label}${mark(key)}`,
        render: () => (
          <PatchEditor
            soundKey={key}
            patch={patch}
            edited={api.isEdited(key)}
            onChange={(next) => api.setSound(key, next)}
            onAudition={audition}
            onReset={() => api.resetSound(key)}
            onSave={() => api.save([key])}
          />
        ),
      })
    }
    const detent = entry.detent
    const tickPatch = detent ? bank.sounds[detent.key] : undefined
    if (detent && isSoundPatch(tickPatch)) {
      tabs.push({
        id: `detent:${detent.key}`,
        label: "detent",
        render: () => (
          <DetentEditor
            ticker={tickPatch.detent ?? DEFAULT_DETENT}
            range={detent.range}
            edited={api.isEdited(detent.key)}
            onChange={(next) => api.setSound(detent.key, { ...tickPatch, detent: next })}
            onReset={() => api.resetSound(detent.key)}
            onSave={() => api.save([detent.key])}
          />
        ),
      })
    }
    return tabs
  }

  const detentStep = (entry: BoardEntry) => {
    const patch = entry.detent ? bank.sounds[entry.detent.key] : undefined
    return isSoundPatch(patch) ? (patch.detent?.step ?? 1) : 1
  }

  return (
    <div className="flex flex-col gap-4">
      {boardEntries.map((entry) => (
        <Card key={entry.id} entry={entry} demo={demoFor(entry, detentStep(entry))} tabs={tabsFor(entry)} />
      ))}
    </div>
  )
}
