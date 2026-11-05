import { useState } from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

import type { ShowcaseDemo } from "../types"

const START = { x: 16, y: 16 }
const WINDOW_WIDTH = "w-60"

function Desk({ children }: { children: React.ReactNode }) {
  return <div className="relative h-72 w-full overflow-hidden bg-desktop">{children}</div>
}

function ClosableWindow() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Desk>
      {isOpen ? (
        <Window
          title="Notes.txt"
          defaultPosition={START}
          className={WINDOW_WIDTH}
          statusBar={<span>Ln 1, Col 1</span>}
          onClose={() => setIsOpen(false)}
        >
          <p className="p-3 text-xl">Buy floppies. Defrag on Sunday.</p>
        </Window>
      ) : (
        <Button size="sm" className="absolute top-4 left-4" onClick={() => setIsOpen(true)}>
          Reopen
        </Button>
      )}
    </Desk>
  )
}

function FullControlsWindow() {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <Desk>
      {isMinimized ? (
        <Button size="sm" className="absolute top-4 left-4" onClick={() => setIsMinimized(false)}>
          Restore
        </Button>
      ) : (
        <Window
          title="Explorer"
          defaultPosition={START}
          className={WINDOW_WIDTH}
          onMinimize={() => setIsMinimized(true)}
          onClose={() => setIsMinimized(true)}
        >
          <p className="p-3 text-xl">Maximize is disabled here.</p>
        </Window>
      )}
    </Desk>
  )
}

export const demo: ShowcaseDemo = {
  span: "full",
  variants: [
    { label: "active, close, status bar", render: () => <ClosableWindow /> },
    { label: "minimize, maximize, close", render: () => <FullControlsWindow /> },
    {
      label: "inactive",
      render: () => (
        <Desk>
          <Window title="Clock" isActive={false} defaultPosition={START} className={WINDOW_WIDTH}>
            <p className="p-3 font-pixel text-[24px] leading-none">12:00</p>
          </Window>
        </Desk>
      ),
    },
    {
      label: "page variant, scrolling body",
      render: () => (
        <Desk>
          <Window title="Readme.txt" variant="page" defaultPosition={START} className={`h-40 ${WINDOW_WIDTH}`}>
            <div className="flex flex-col gap-2 p-3 text-xl">
              {Array.from({ length: 8 }, (_, index) => (
                <p key={index}>Line {index + 1}. Long files scroll inside the window.</p>
              ))}
            </div>
          </Window>
        </Desk>
      ),
    },
    {
      label: "bare",
      render: () => (
        <Desk>
          <Window title="About" defaultPosition={START} className={WINDOW_WIDTH}>
            <p className="p-3 text-xl">NOSTALGUI v0.0.1</p>
          </Window>
        </Desk>
      ),
    },
  ],
}
