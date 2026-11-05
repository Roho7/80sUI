"use client"

import { FileAlt, Folder, Github } from "@nsmr/pixelart-react"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"

import { DesktopIcon } from "@/components/retro/desktop-icon"
import { ErrorDialogStack, type ErrorEntry } from "@/components/retro/error-dialog"
import type { Point } from "@/hooks/use-window-drag"

import { AboutWindow } from "./AboutWindow"
import { BuilderWindow } from "./BuilderWindow"
import { ControlPanelWindow } from "./ControlPanelWindow"
import { HexBackdrop } from "./HexBackdrop"
import { IdeasWindow } from "./IdeasWindow"
import { InstallWindow } from "./InstallWindow"
import { PaintWindow } from "./PaintWindow"
import { ProblemsWindow } from "./ProblemsWindow"
import { Taskbar } from "./Taskbar"
import { TerminalWindow } from "./TerminalWindow"

type WindowId = "about" | "install" | "builder" | "terminal" | "paint" | "problems" | "ideas" | "control"

type WindowPlacement = {
  position: Point
  width: string
}

const PLACEMENTS: Record<WindowId, WindowPlacement> = {
  about: { position: { x: 120, y: 24 }, width: "xl:w-[470px]" },
  install: { position: { x: 612, y: 16 }, width: "xl:w-[420px]" },
  builder: { position: { x: 1050, y: 40 }, width: "xl:w-[214px]" },
  terminal: { position: { x: 890, y: 372 }, width: "xl:w-[380px]" },
  paint: { position: { x: 330, y: 400 }, width: "xl:w-[580px]" },
  problems: { position: { x: 24, y: 520 }, width: "xl:w-[380px]" },
  ideas: { position: { x: 588, y: 384 }, width: "xl:w-[300px]" },
  control: { position: { x: 840, y: 650 }, width: "xl:w-[420px]" },
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

function useWindowOrder() {
  const [order, setOrder] = useState<readonly WindowId[]>(INITIAL_ORDER)
  const raise = useCallback((id: WindowId) => {
    setOrder((current) =>
      current[current.length - 1] === id
        ? current
        : [...current.filter((existing) => existing !== id), id]
    )
  }, [])
  const readWindowProps = (id: WindowId) => ({
    isActive: order[order.length - 1] === id,
    onActivate: () => raise(id),
    defaultPosition: PLACEMENTS[id].position,
    className: `max-xl:static w-full ${PLACEMENTS[id].width}`,
    style: { zIndex: order.indexOf(id) + 1 },
  })
  return readWindowProps
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
      className="flex gap-2 self-start bg-desktop p-1 xl:absolute xl:top-4 xl:left-4 xl:flex-col"
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
  const readWindowProps = useWindowOrder()
  const { errors, spawnErrors, dismissError } = useErrorStack()
  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-desktop xl:h-svh xl:min-h-[920px]">
      <HexBackdrop />
      <div className="relative flex flex-col gap-6 px-4 pt-4 pb-24 xl:mx-auto xl:block xl:h-full xl:w-[1280px] xl:p-0">
        <DesktopIcons />
        <AboutWindow itemCount={itemCount} {...readWindowProps("about")} />
        <InstallWindow {...readWindowProps("install")} />
        <TerminalWindow {...readWindowProps("terminal")} />
        <BuilderWindow {...readWindowProps("builder")} />
        <PaintWindow {...readWindowProps("paint")} />
        <ProblemsWindow {...readWindowProps("problems")} onCancel={() => spawnErrors(1)} />
        <ControlPanelWindow {...readWindowProps("control")} onSpawnError={() => spawnErrors(1)} />
        <IdeasWindow {...readWindowProps("ideas")} onAcknowledge={() => spawnErrors(4)} />
      </div>
      <ErrorDialogStack errors={errors} onDismiss={dismissError} />
      <Taskbar onShutDown={() => spawnErrors(1)} />
    </main>
  )
}

export { Desktop }
