"use client"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

import type { DesktopWindowProps } from "./types"

type IdeasWindowProps = DesktopWindowProps & {
  onAcknowledge: () => void
}

function IdeasWindow({ onAcknowledge, ...windowProps }: IdeasWindowProps) {
  return (
    <Window
      title="Error"
      {...windowProps}
    >
      <div className="flex flex-col items-center gap-5 px-4 py-6">
        <p className="font-pixel text-[24px] leading-none">Ideas missing</p>
        <Button className="min-w-32" onClick={onAcknowledge}>
          OK
        </Button>
      </div>
    </Window>
  )
}

export { IdeasWindow }
