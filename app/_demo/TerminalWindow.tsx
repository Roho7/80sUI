"use client"

import { Terminal, type TerminalLine } from "@/components/retro/terminal"
import { Window } from "@/components/retro/window"
import { registryItemUrl } from "@/lib/site"

import type { DesktopWindowProps } from "./types"

const SCRIPT: readonly TerminalLine[] = [
  { kind: "command", text: "npx create-next-app@latest my-retro-app" },
  { kind: "output", text: "Success! Created my-retro-app" },
  { kind: "command", text: "cd my-retro-app && npx shadcn@latest init -b radix" },
  { kind: "output", text: "Base: radix ................. OK" },
  { kind: "output", text: "Writing components.json ..... OK" },
  { kind: "command", text: `npx shadcn@latest add ${registryItemUrl("theme")}` },
  { kind: "output", text: "Updating app/globals.css .... OK" },
  { kind: "command", text: `npx shadcn@latest add ${registryItemUrl("terminal")}` },
  { kind: "output", text: "Created components/retro/terminal.tsx" },
  { kind: "output", text: "" },
  { kind: "output", text: "NOSTALGUI installed. Welcome back to 1995." },
]

function TerminalWindow(windowProps: DesktopWindowProps) {
  return (
    <Window title="install.bat" statusBar={<span>{SCRIPT.length} lines</span>} {...windowProps}>
      <Terminal lines={SCRIPT} isLooping className="h-60" />
    </Window>
  )
}

export { TerminalWindow }
