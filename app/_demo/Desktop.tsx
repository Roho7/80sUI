"use client"

import { FileAlt, Folder, Github } from "@nsmr/pixelart-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"

import { ErrorDialogStack, type ErrorEntry } from "@/components/retro/error-dialog"
import { TaskbarTask } from "@/components/retro/taskbar"
import type { Point } from "@/hooks/use-window-drag"

import { Taskbar } from "../_site/Taskbar"
import { AboutWindow } from "./AboutWindow"
import { BuilderWindow } from "./BuilderWindow"
import { ControlPanelWindow } from "./ControlPanelWindow"
import { DesktopIcon } from "./DesktopIcon"
import { IdeasWindow } from "./IdeasWindow"
import { InstallWindow } from "./InstallWindow"
import { PaintWindow } from "./PaintWindow"
import { ProblemsWindow } from "./ProblemsWindow"
import { TerminalWindow } from "./TerminalWindow"
import { Wallpaper } from "./Wallpaper"

type WindowId = "about" | "install" | "builder" | "terminal" | "paint" | "problems" | "ideas" | "control"

type WindowStatus = "open" | "minimized" | "closed"

type WindowPlacement = {
  position: Point
  width: string
}

const WINDOW_TITLES: Record<WindowId, string> = {
  about: "README.TXT",
  install: "Setup.exe",
  builder: "Roho7.vcf",
  terminal: "install.bat",
  paint: "untitled - Paint",
  problems: "Downloading",
  ideas: "INFO",
  control: "Control Panel",
}

const REOPEN_DELAY_MS = 3000

const PLACEMENTS: Record<WindowId, WindowPlacement> = {
  about: { position: { x: 120, y: 24 }, width: "xl:w-[470px]" },
  install: { position: { x: 612, y: 16 }, width: "xl:w-[420px]" },
  builder: { position: { x: 1050, y: 40 }, width: "xl:w-[214px]" },
  terminal: { position: { x: 890, y: 372 }, width: "xl:w-[380px]" },
  paint: { position: { x: 330, y: 400 }, width: "xl:w-[580px]" },
  problems: { position: { x: 24, y: 520 }, width: "xl:w-[380px]" },
  ideas: { position: { x: 588, y: 384 }, width: "xl:w-[300px]" },
  control: { position: { x: 840, y: 540 }, width: "xl:w-[420px]" },
}

const INITIAL_ORDER: readonly WindowId[] = [
  "paint",
  "problems",
  "terminal",
  "control",
  "builder",
  "install",
  "ideas",
  "about",
]

const ERROR_MESSAGES = [
  "Not found.",
  "Fail.",
  "Cannot cancel. Problems are permanent.",
  "Motivation.dll is missing.",
  "Deadline moved. Again.",
] as const

const ICONS = [
  { label: "Components", href: "/components", icon: <Folder size={36} className="fill-current" aria-hidden="true" /> },
  { label: "Docs", href: "/docs", icon: <FileAlt size={36} className="fill-current" aria-hidden="true" /> },
  { label: "Source", href: "https://github.com/Roho7/80sUI", icon: <Github size={36} className="fill-current" aria-hidden="true" /> },
] as const

type DesktopState = {
  status: Record<WindowId, WindowStatus>
  order: readonly WindowId[]
}

type DesktopEvent =
  | { type: "raise"; id: WindowId }
  | { type: "minimize"; id: WindowId }
  | { type: "close"; id: WindowId }
  | { type: "restore"; id: WindowId }

const INITIAL_STATE: DesktopState = {
  status: Object.fromEntries(INITIAL_ORDER.map((id) => [id, "open"])) as Record<WindowId, WindowStatus>,
  order: INITIAL_ORDER,
}

function withStatus(state: DesktopState, id: WindowId, status: WindowStatus): DesktopState {
  return state.status[id] === status ? state : { ...state, status: { ...state.status, [id]: status } }
}

function raiseOrder(state: DesktopState, id: WindowId): DesktopState {
  return state.order[state.order.length - 1] === id
    ? state
    : { ...state, order: [...state.order.filter((existing) => existing !== id), id] }
}

function desktopReducer(state: DesktopState, event: DesktopEvent): DesktopState {
  switch (event.type) {
    case "raise":
      return raiseOrder(state, event.id)
    case "minimize":
      return withStatus(state, event.id, "minimized")
    case "close":
      return withStatus(state, event.id, "closed")
    case "restore":
      return raiseOrder(withStatus(state, event.id, "open"), event.id)
  }
}

function findTopOpenId(state: DesktopState) {
  return state.order.findLast((id) => state.status[id] === "open")
}

function useReopenTimers(status: Record<WindowId, WindowStatus>, restore: (id: WindowId) => void) {
  const timersRef = useRef(new Map<WindowId, number>())
  useEffect(() => {
    const timers = timersRef.current
    for (const id of INITIAL_ORDER) {
      const timer = timers.get(id)
      if (status[id] !== "open" && timer === undefined) {
        timers.set(id, window.setTimeout(() => {
          timers.delete(id)
          restore(id)
        }, REOPEN_DELAY_MS))
      } else if (status[id] === "open" && timer !== undefined) {
        window.clearTimeout(timer)
        timers.delete(id)
      }
    }
  }, [status, restore])
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])
}

function useDesktopWindows() {
  const [state, dispatch] = useReducer(desktopReducer, INITIAL_STATE)
  const restore = useCallback((id: WindowId) => dispatch({ type: "restore", id }), [])
  useReopenTimers(state.status, restore)
  const topOpenId = findTopOpenId(state)
  const readWindowProps = (id: WindowId) => ({
    title: WINDOW_TITLES[id],
    isActive: topOpenId === id,
    onActivate: () => dispatch({ type: "raise", id }),
    onMinimize: () => dispatch({ type: "minimize", id }),
    onClose: () => dispatch({ type: "close", id }),
    defaultPosition: PLACEMENTS[id].position,
    className: `max-xl:static w-full ${PLACEMENTS[id].width}${state.status[id] === "open" ? "" : " hidden!"}`,
    style: { zIndex: state.order.indexOf(id) + 1 },
  })
  const readTaskButtons = () =>
    INITIAL_ORDER.map((id) => {
      const isPressed = topOpenId === id
      return (
        <TaskbarTask
          key={id}
          isActive={isPressed}
          className="max-xl:hidden"
          onClick={() => dispatch({ type: isPressed ? "minimize" : "restore", id })}
        >
          {WINDOW_TITLES[id]}
        </TaskbarTask>
      )
    })
  return { readWindowProps, readTaskButtons }
}

function useErrorStack() {
  const [errors, setErrors] = useState<readonly ErrorEntry[]>([])
  const nextIdRef = useRef(0)
  const spawnErrors = useCallback((count: number) => {
    const spawned = Array.from({ length: count }, () => {
      nextIdRef.current += 1
      const id = nextIdRef.current
      return {
        id: String(id),
        message: ERROR_MESSAGES[id % ERROR_MESSAGES.length],
      }
    })
    setErrors((current) => [...current, ...spawned].slice(-12))
  }, [])
  const dismissError = useCallback((id: string) => {
    setErrors((current) => current.filter((error) => error.id !== id))
  }, [])
  return { errors, spawnErrors, dismissError }
}

function DesktopIcons() {
  const router = useRouter()
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  return (
    <nav
      aria-label="Desktop shortcuts"
      className="flex gap-2 self-start p-1 xl:absolute xl:top-4 xl:left-4 xl:flex-col"
    >
      {ICONS.map(({ label, href, icon }) => (
        <DesktopIcon
          key={label}
          label={label}
          icon={icon}
          isSelected={selectedLabel === label}
          onSelect={() => setSelectedLabel(label)}
          onOpen={() => (href.startsWith("/") ? router.push(href) : window.open(href, "_blank", "noreferrer"))}
        />
      ))}
    </nav>
  )
}

type DesktopProps = {
  itemCount: number
}

function Desktop({ itemCount }: DesktopProps) {
  const { readWindowProps, readTaskButtons } = useDesktopWindows()
  const { errors, spawnErrors, dismissError } = useErrorStack()
  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-desktop xl:h-svh">
      <Wallpaper />
      <div className="relative flex flex-col gap-6 px-4 pt-4 pb-24 xl:mx-auto xl:block xl:h-full xl:w-[1280px] xl:p-0">
        <DesktopIcons />
        <AboutWindow itemCount={itemCount} {...readWindowProps("about")} />
        <InstallWindow {...readWindowProps("install")} />
        <TerminalWindow {...readWindowProps("terminal")} />
        <BuilderWindow {...readWindowProps("builder")} />
        <PaintWindow {...readWindowProps("paint")} />
        <ProblemsWindow {...readWindowProps("problems")} onCancel={() => spawnErrors(1)} />
        <ControlPanelWindow {...readWindowProps("control")} />
        <IdeasWindow {...readWindowProps("ideas")} onAcknowledge={() => spawnErrors(4)} />
      </div>
      <ErrorDialogStack errors={errors} onDismiss={dismissError} />
      <Taskbar onShutDown={() => spawnErrors(1)}>{readTaskButtons()}</Taskbar>
    </main>
  )
}

export { Desktop }
