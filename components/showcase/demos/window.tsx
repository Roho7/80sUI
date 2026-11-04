import { useState } from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

import type { ShowcaseDemo } from "../types"

function ClosableWindow() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button size="sm" className="self-center" onClick={() => setIsOpen(true)}>
        Reopen
      </Button>
    )
  }

  return (
    <Window
      title="Notes.txt"
      className="w-full"
      statusBar={<span>Ln 1, Col 1</span>}
      onClose={() => setIsOpen(false)}
    >
      <p className="p-3 text-xl">Buy floppies. Defrag on Sunday.</p>
    </Window>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "active, close, status bar", render: () => <ClosableWindow /> },
    {
      label: "inactive",
      render: () => (
        <Window title="Clock" isActive={false} className="w-full">
          <p className="p-3 font-pixel text-[24px] leading-none">12:00</p>
        </Window>
      ),
    },
    {
      label: "bare",
      render: () => (
        <Window title="About" className="w-full">
          <p className="p-3 text-xl">dither-ui v0.0.1</p>
        </Window>
      ),
    },
  ],
}
