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

function FullControlsWindow() {
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <Button size="sm" className="self-center" onClick={() => setIsMinimized(false)}>
        Restore
      </Button>
    )
  }

  return (
    <Window title="Explorer" className="w-full" onMinimize={() => setIsMinimized(true)} onClose={() => setIsMinimized(true)}>
      <p className="p-3 text-xl">Maximize is disabled here.</p>
    </Window>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "active, close, status bar", render: () => <ClosableWindow /> },
    { label: "minimize, maximize, close", render: () => <FullControlsWindow /> },
    {
      label: "inactive",
      render: () => (
        <Window title="Clock" isActive={false} className="w-full">
          <p className="p-3 font-pixel text-[24px] leading-none">12:00</p>
        </Window>
      ),
    },
    {
      label: "page variant, scrolling body",
      render: () => (
        <Window title="Readme.txt" variant="page" className="h-40 w-full">
          <div className="flex flex-col gap-2 p-3 text-xl">
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index}>Line {index + 1}. Long files scroll inside the window.</p>
            ))}
          </div>
        </Window>
      ),
    },
    {
      label: "bare",
      render: () => (
        <Window title="About" className="w-full">
          <p className="p-3 text-xl">NOSTALGUI v0.0.1</p>
        </Window>
      ),
    },
  ],
}
