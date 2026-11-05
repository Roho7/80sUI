"use client"

import { Window } from "@/components/retro/window"

import { ThemeControls } from "../_site/ThemeControls"
import type { DesktopWindowProps } from "./types"

type ControlPanelWindowProps = DesktopWindowProps

function ControlPanelWindow({ ...windowProps }: ControlPanelWindowProps) {
  return (
    <Window
      {...windowProps}
    >
      <div className="flex flex-col gap-4 p-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-pixel text-[16px] uppercase">Theme</legend>
          <ThemeControls />
        </fieldset>
      </div>
    </Window>
  )
}

export { ControlPanelWindow }
