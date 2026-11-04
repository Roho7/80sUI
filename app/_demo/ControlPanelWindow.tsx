"use client"

import { Window, type WindowProps } from "@/components/retro/window"
import { Button } from "@/components/ui/button"

import { ThemeControls } from "../_site/ThemeControls"

type ControlPanelWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style"> & {
  onSpawnError: () => void
}

function ControlPanelWindow({ onSpawnError, ...windowProps }: ControlPanelWindowProps) {
  return (
    <Window
      title="Control Panel"
      defaultPosition={{ x: 900, y: 470 }}
      className="w-[340px]"
      {...windowProps}
    >
      <div className="flex flex-col gap-4 p-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-pixel text-[16px] uppercase">Theme</legend>
          <ThemeControls />
        </fieldset>
        <Button variant="destructive" size="sm" className="self-start" onClick={onSpawnError}>
          Spawn error
        </Button>
      </div>
    </Window>
  )
}

export { ControlPanelWindow }
