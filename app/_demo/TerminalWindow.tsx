"use client"

import { Terminal, type TerminalLine } from "@/components/retro/terminal"
import { Window, type WindowProps } from "@/components/retro/window"

type TerminalWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style">

const SCRIPT: readonly TerminalLine[] = [
  { kind: "command", text: "scandisk /all" },
  { kind: "output", text: "2bd49711 - ncrc710.sys ... ok" },
  { kind: "output", text: "2bd4971a - atd.sys ....... ok" },
  { kind: "output", text: "2bd49666 - Floppy.SYS .... FAIL" },
  { kind: "output", text: "" },
  { kind: "output", text: "Warning : Your data has been stolen." },
  { kind: "output", text: "There is nothing you can do now." },
  { kind: "output", text: "Proceed With Caution." },
  { kind: "output", text: "" },
]

function TerminalWindow(windowProps: TerminalWindowProps) {
  return (
    <Window
      title="Terminal.exe"
      defaultPosition={{ x: 32, y: 40 }}
      className="w-[440px]"
      statusBar={<span>{SCRIPT.length} lines</span>}
      {...windowProps}
    >
      <Terminal lines={SCRIPT} isLooping className="h-64" />
    </Window>
  )
}

export { TerminalWindow }
