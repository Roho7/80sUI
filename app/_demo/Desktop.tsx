"use client"

import { useCallback, useRef, useState } from "react"

import { ErrorDialogStack,type ErrorEntry } from "@/components/retro/error-dialog"

import { ControlPanelWindow } from "./ControlPanelWindow"
import { HexBackdrop } from "./HexBackdrop"
import { IdeasWindow } from "./IdeasWindow"
import { PaintWindow } from "./PaintWindow"
import { ProblemsWindow } from "./ProblemsWindow"
import { Taskbar } from "./Taskbar"
import { TerminalWindow } from "./TerminalWindow"

type WindowId = "terminal" | "paint" | "problems" | "ideas" | "control"

const INITIAL_ORDER: readonly WindowId[] = ["terminal", "paint", "problems", "ideas", "control"]

const ERROR_MESSAGES = [
  "Not found.",
  "Fail.",
  "Cannot cancel. Problems are permanent.",
  "Motivation.dll is missing.",
  "Deadline moved. Again.",
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

function Desktop() {
  const readWindowProps = useWindowOrder()
  const { errors, spawnErrors, dismissError } = useErrorStack()
  return (
    <main className="relative h-svh min-h-[760px] w-full min-w-[1280px] overflow-hidden bg-desktop">
      <HexBackdrop />
      <TerminalWindow {...readWindowProps("terminal")} />
      <PaintWindow {...readWindowProps("paint")} />
      <ProblemsWindow {...readWindowProps("problems")} onCancel={() => spawnErrors(1)} />
      <IdeasWindow {...readWindowProps("ideas")} onAcknowledge={() => spawnErrors(4)} />
      <ControlPanelWindow {...readWindowProps("control")} onSpawnError={() => spawnErrors(1)} />
      <ErrorDialogStack errors={errors} onDismiss={dismissError} />
      <Taskbar onShutDown={() => spawnErrors(1)} />
    </main>
  )
}

export { Desktop }
