import type { SoundEngine, SoundLoopHandle } from "./sound-engine"

export type SoundGesture = "press" | "toggle" | "select" | "menu" | "steps" | "drag"

type SlotRule = { key: (element: Element) => string; gesture: SoundGesture | ((element: Element) => SoundGesture) }

const SMALL_SIZES = new Set(["xs", "icon", "icon-xs", "icon-sm"])

const fixed = (key: string) => () => key

export const soundSlots: Record<string, SlotRule> = {
  button: { key: (element) => (SMALL_SIZES.has(element.getAttribute("data-size") ?? "") ? "small-button" : "button"), gesture: "press" },
  "cta-button": { key: fixed("keycap"), gesture: "press" },
  checkbox: { key: fixed("checkbox"), gesture: "toggle" },
  switch: { key: fixed("switch"), gesture: "toggle" },
  "radio-group-item": { key: fixed("radio"), gesture: "select" },
  "tabs-trigger": { key: fixed("tab"), gesture: "select" },
  "dropdown-menu-item": { key: fixed("menu"), gesture: "menu" },
  "dropdown-menu-checkbox-item": { key: fixed("menu"), gesture: "menu" },
  "dropdown-menu-radio-item": { key: fixed("menu"), gesture: "menu" },
  "menubar-item": { key: fixed("menu"), gesture: "menu" },
  "menubar-checkbox-item": { key: fixed("menu"), gesture: "menu" },
  "menubar-radio-item": { key: fixed("menu"), gesture: "menu" },
  "select-item": { key: fixed("menu"), gesture: "menu" },
  "context-menu-item": { key: fixed("menu"), gesture: "menu" },
  "context-menu-checkbox-item": { key: fixed("menu"), gesture: "menu" },
  "context-menu-radio-item": { key: fixed("menu"), gesture: "menu" },
  "command-item": { key: fixed("menu"), gesture: "menu" },
  toggle: { key: fixed("toggle"), gesture: "toggle" },
  "toggle-group-item": { key: fixed("toggle"), gesture: (element) => (element.getAttribute("role") === "radio" ? "select" : "toggle") },
  slider: { key: fixed("slider"), gesture: "steps" },
  "resizable-handle": { key: fixed("slider"), gesture: "steps" },
  "sidebar-menu-button": { key: (element) => (element.getAttribute("data-size") === "sm" ? "small-button" : "button"), gesture: "press" },
  "sidebar-menu-sub-button": { key: fixed("small-button"), gesture: "press" },
  window: { key: fixed("drag"), gesture: "drag" },
}

type Target = { element: Element; key: string; gesture: SoundGesture }

const BUTTON_LIKE_SUFFIXES = ["-trigger", "-action", "-cancel", "-close", "-link"]
const RECENT_MS = 400
const DISABLED = ":disabled, [aria-disabled='true'], [data-disabled]"

function resolveTarget(start: EventTarget | null): Target | null {
  let node = start instanceof Element ? start : null
  while (node) {
    const sound = node.getAttribute("data-sound")
    if (sound === "none") {
      return null
    }
    const slot = node.getAttribute("data-slot")
    const rule = slot ? (soundSlots[slot] ?? (BUTTON_LIKE_SUFFIXES.some((suffix) => slot.endsWith(suffix)) ? soundSlots.button : undefined)) : undefined
    const gesture = typeof rule?.gesture === "function" ? rule.gesture(node) : rule?.gesture
    if (sound) {
      return { element: node, key: sound, gesture: gesture ?? "press" }
    }
    if (rule && gesture) {
      return { element: node, key: rule.key(node), gesture }
    }
    node = node.parentElement
  }
  return null
}

function isOn(element: Element, attribute: string): boolean {
  return element.getAttribute(attribute) === "true"
}

function toggleAttribute(element: Element): string {
  return element.hasAttribute("aria-pressed") ? "aria-pressed" : "aria-checked"
}

export function attachSoundSlots(engine: SoundEngine, root: Document = document): () => void {
  const recent = new WeakMap<Element, number>()
  const values = new WeakMap<Element, { value: number; carry: number }>()
  let pressed: Target | null = null
  let dragLoop: SoundLoopHandle | null = null
  let dragKey = ""
  let lastPointer: { x: number; y: number } | null = null

  const markRecent = (element: Element) => recent.set(element, performance.now())
  const takeRecent = (element: Element) => {
    const time = recent.get(element)
    recent.delete(element)
    return time !== undefined && performance.now() - time < RECENT_MS
  }

  const release = () => {
    if (pressed) {
      engine.play(`${pressed.key}.release`)
      pressed = null
    }
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!engine.enabled || event.button !== 0) {
      return
    }
    engine.unlock()
    lastPointer = { x: event.clientX, y: event.clientY }
    const target = resolveTarget(event.target)
    if (!target || target.element.matches(DISABLED)) {
      return
    }
    const { element, key, gesture } = target
    if (gesture === "press") {
      pressed = target
      engine.play(`${key}.press`)
    } else if (gesture === "toggle") {
      markRecent(element)
      engine.play(`${key}.${isOn(element, toggleAttribute(element)) ? "off" : "on"}`)
    } else if (gesture === "select") {
      const attribute = element.hasAttribute("aria-selected") ? "aria-selected" : "aria-checked"
      if (!isOn(element, attribute)) {
        markRecent(element)
        engine.play(`${key}.select`)
      }
    }
  }

  const onPointerUp = (event: PointerEvent) => {
    release()
    if (!engine.enabled || event.button !== 0) {
      return
    }
    const target = resolveTarget(event.target)
    if (target?.gesture === "menu" && !target.element.matches(DISABLED)) {
      engine.play(`${target.key}.select`)
    }
  }

  const onPointerMove = (event: PointerEvent) => {
    if (dragLoop && lastPointer) {
      dragLoop.move(Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y))
    }
    lastPointer = { x: event.clientX, y: event.clientY }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!engine.enabled || event.repeat || (event.key !== " " && event.key !== "Enter")) {
      return
    }
    const target = resolveTarget(event.target)
    if (!target || target.element.matches(DISABLED)) {
      return
    }
    if (target.gesture === "press") {
      pressed = target
      engine.play(`${target.key}.press`)
    } else if (target.gesture === "menu") {
      engine.play(`${target.key}.select`)
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      release()
    }
  }

  const onMutation = (records: MutationRecord[]) => {
    if (!engine.enabled) {
      return
    }
    for (const record of records) {
      const element = record.target
      if (!(element instanceof Element) || !record.attributeName) {
        continue
      }
      const attribute = record.attributeName
      const target = resolveTarget(element)
      if (!target) {
        continue
      }
      if (attribute === "data-dragging" && target.gesture === "drag" && target.element === element) {
        if (isOn(element, "data-dragging")) {
          dragLoop?.stop()
          dragKey = target.key
          engine.play(`${dragKey}.pickup`)
          dragLoop = engine.startLoop(`${dragKey}.friction`)
        } else if (dragKey) {
          dragLoop?.stop()
          dragLoop = null
          engine.play(`${dragKey}.drop`)
          dragKey = ""
        }
        continue
      }
      if (target.element !== element && target.gesture !== "steps") {
        continue
      }
      if (target.gesture === "toggle" && attribute === toggleAttribute(element)) {
        if (!takeRecent(element)) {
          engine.play(`${target.key}.${isOn(element, attribute) ? "on" : "off"}`)
        }
      } else if (target.gesture === "select" && (attribute === "aria-checked" || attribute === "aria-selected")) {
        if (isOn(element, attribute) && !takeRecent(element)) {
          engine.play(`${target.key}.select`)
        }
      } else if (target.gesture === "steps" && attribute === "aria-valuenow") {
        const value = Number(element.getAttribute("aria-valuenow"))
        const previous = values.get(element)
        if (!previous || !Number.isFinite(value)) {
          values.set(element, { value, carry: 0 })
          continue
        }
        const tickKey = `${target.key}.tick`
        const min = Number(element.getAttribute("aria-valuemin") ?? 0)
        const max = Number(element.getAttribute("aria-valuemax") ?? 100)
        const range = max > min ? max - min : 100
        const percent = (Math.abs(value - previous.value) / range) * 100
        const units = percent / Math.max(engine.detent(tickKey).step, 1e-6) + previous.carry
        const steps = Math.floor(units + 1e-9)
        values.set(element, { value, carry: units - steps })
        engine.step(tickKey, steps, max > min ? (value - min) / range : 0.5)
      }
    }
  }

  const primeSliders = () => {
    for (const thumb of root.querySelectorAll("[role='slider'][aria-valuenow]")) {
      if (!values.has(thumb)) {
        values.set(thumb, { value: Number(thumb.getAttribute("aria-valuenow")), carry: 0 })
      }
    }
  }

  const onFocusIn = () => primeSliders()
  const observer = new MutationObserver(onMutation)
  observer.observe(root.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-checked", "aria-pressed", "aria-selected", "aria-valuenow", "data-dragging"],
  })
  const options = { capture: true, passive: true }
  root.addEventListener("pointerdown", onPointerDown, options)
  root.addEventListener("pointerdown", primeSliders, options)
  root.addEventListener("pointerup", onPointerUp, options)
  root.addEventListener("pointercancel", release, options)
  root.addEventListener("pointermove", onPointerMove, options)
  root.addEventListener("keydown", onKeyDown, options)
  root.addEventListener("keyup", onKeyUp, options)
  root.addEventListener("focusin", onFocusIn, options)

  return () => {
    observer.disconnect()
    dragLoop?.stop()
    root.removeEventListener("pointerdown", onPointerDown, options)
    root.removeEventListener("pointerdown", primeSliders, options)
    root.removeEventListener("pointerup", onPointerUp, options)
    root.removeEventListener("pointercancel", release, options)
    root.removeEventListener("pointermove", onPointerMove, options)
    root.removeEventListener("keydown", onKeyDown, options)
    root.removeEventListener("keyup", onKeyUp, options)
    root.removeEventListener("focusin", onFocusIn, options)
  }
}
