"use client"

import { useEffect, useRef, useState } from "react"

import { Window, type WindowProps } from "@/components/retro/window"
import { useEink, useEinkRefresh } from "@/lib/eink"

type TerminalWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style">

const SCRIPT = [
  "C:\\> scandisk /all",
  "2bd49711 - ncrc710.sys ... ok",
  "2bd4971a - atd.sys ....... ok",
  "2bd49666 - Floppy.SYS .... FAIL",
  "",
  "Warning : Your data has been stolen.",
  "There is nothing you can do now.",
  "Proceed With Caution.",
  "",
  "C:\\> _",
].join("\n")

const PAUSE_CHARACTERS = 60

function useTypedScript(): string {
  const { engine } = useEink()
  const fps = engine?.readFps() ?? 12
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(
      () => setCursor((current) => (current + 1) % (SCRIPT.length + PAUSE_CHARACTERS)),
      1000 / fps
    )
    return () => window.clearInterval(interval)
  }, [fps])

  return SCRIPT.slice(0, cursor)
}

function TerminalWindow(windowProps: TerminalWindowProps) {
  const screenRef = useRef<HTMLPreElement>(null)
  const refresh = useEinkRefresh(screenRef, "partial")
  const typed = useTypedScript()
  const lineCount = typed.split("\n").length

  useEffect(() => {
    refresh()
  }, [lineCount, refresh])

  return (
    <Window
      title="Terminal.exe"
      defaultPosition={{ x: 32, y: 40 }}
      className="w-[440px]"
      statusBar={<span>{lineCount} lines</span>}
      {...windowProps}
    >
      <pre
        ref={screenRef}
        className="h-64 overflow-hidden bg-foreground p-3 text-xl leading-tight whitespace-pre-wrap text-background"
      >
        {typed}
        <span className="animate-blink">█</span>
      </pre>
    </Window>
  )
}

export { TerminalWindow }
