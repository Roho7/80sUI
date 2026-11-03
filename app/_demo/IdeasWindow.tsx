"use client"

import { Window, type WindowProps } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

type IdeasWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style"> & {
  onAcknowledge: () => void
}

function IdeasWindow({ onAcknowledge, ...windowProps }: IdeasWindowProps) {
  return (
    <Window
      title="Error"
      defaultPosition={{ x: 560, y: 500 }}
      className="w-[300px]"
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
