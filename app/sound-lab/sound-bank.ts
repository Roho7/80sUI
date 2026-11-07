import { soundsConfig } from "@/lib/sound/config"
import type { SoundsConfig } from "@/lib/sound/types"

export type StepRange = { min: number; max: number; unit: string }

export type BoardEntry = {
  id: string
  name: string
  note: string
  sounds: { key: string; label: string }[]
  detent?: { key: string; range: StepRange }
  loop?: string
  shipped: boolean
}

export const defaultBank: SoundsConfig = { ...soundsConfig, enabled: true }

export const boardEntries: BoardEntry[] = [
  { id: "button", name: "Button", note: "Tactile switch. data-slot=\"button\", press on pointer down, release on pointer up.", sounds: [{ key: "button.press", label: "press" }, { key: "button.release", label: "release" }], shipped: true },
  { id: "small-button", name: "Small / icon button", note: "Buttons with size xs, icon, icon-xs or icon-sm use the smaller switch.", sounds: [{ key: "small-button.press", label: "press" }, { key: "small-button.release", label: "release" }], shipped: true },
  { id: "keycap", name: "CTA keycap", note: "data-slot=\"cta-button\": the bigger switch.", sounds: [{ key: "keycap.press", label: "press" }, { key: "keycap.release", label: "release" }], shipped: true },
  { id: "tabs", name: "Tabs", note: "Plays when a tab becomes selected, by pointer or arrow keys.", sounds: [{ key: "tab.select", label: "select" }], shipped: true },
  { id: "menu", name: "Menu items", note: "Dropdown menu, menubar and select items, on release or Enter.", sounds: [{ key: "menu.select", label: "select" }], shipped: true },
  { id: "checkbox", name: "Checkbox", note: "On pointer down, predicting the new state; keyboard toggles play when aria-checked changes.", sounds: [{ key: "checkbox.on", label: "on" }, { key: "checkbox.off", label: "off" }], shipped: true },
  { id: "radio", name: "Radio group", note: "Plays when an item becomes checked.", sounds: [{ key: "radio.select", label: "select" }], shipped: true },
  { id: "switch", name: "Switch", note: "Latch on and off.", sounds: [{ key: "switch.on", label: "on" }, { key: "switch.off", label: "off" }], shipped: true },
  { id: "toggle", name: "Toggle and toggle group", note: "Toggles latch with aria-pressed; a single-choice group plays select.", sounds: [{ key: "toggle.on", label: "on" }, { key: "toggle.off", label: "off" }, { key: "toggle.select", label: "select" }], shipped: true },
  { id: "slider", name: "Slider", note: "One tick per detent step of value units, read from aria-valuenow.", sounds: [{ key: "slider.tick", label: "tick" }], detent: { key: "slider.tick", range: { min: 1, max: 25, unit: "value" } }, shipped: true },
  { id: "drag", name: "Window drag", note: "Pick-up and drop when data-dragging flips, friction while it moves.", sounds: [{ key: "drag.pickup", label: "pick-up" }, { key: "drag.drop", label: "drop" }], loop: "drag.friction", shipped: true },
  { id: "typewriter", name: "Text fields", note: "Inputs and textareas, one strike per typed character from the input event: key for letters and deletes, space for the space bar, return for a new line.", sounds: [{ key: "typewriter.key", label: "key" }, { key: "typewriter.space", label: "space" }, { key: "typewriter.return", label: "return" }], shipped: true },
  { id: "pad", name: "Drag pad (lab only)", note: "Tick per step of travel.", sounds: [{ key: "pad.tick", label: "tick" }], detent: { key: "pad.tick", range: { min: 2, max: 64, unit: "px" } }, shipped: false },
  { id: "dial", name: "Rotary dial (placeholder)", note: "Tick per detent, knock at the end stops.", sounds: [{ key: "dial.tick", label: "detent" }, { key: "dial.end", label: "end stop" }], detent: { key: "dial.tick", range: { min: 5, max: 45, unit: "deg" } }, shipped: false },
  { id: "lever", name: "Lever switch (placeholder)", note: "Ratchet while moving, clunk at each end.", sounds: [{ key: "lever.tick", label: "ratchet" }, { key: "lever.on", label: "clunk on" }, { key: "lever.off", label: "clunk off" }], detent: { key: "lever.tick", range: { min: 2, max: 24, unit: "notches" } }, shipped: false },
]
