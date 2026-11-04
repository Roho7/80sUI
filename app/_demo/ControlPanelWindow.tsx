"use client"

import { useTheme } from "next-themes"

import { Window, type WindowProps } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { type Palette, PALETTES } from "./palettes"
import { useIsHydrated } from "./useIsHydrated"

type ControlPanelWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style"> & {
  palette: Palette
  onPaletteChange: (palette: Palette) => void
  onSpawnError: () => void
}

function ControlPanelWindow({
  palette,
  onPaletteChange,
  onSpawnError,
  ...windowProps
}: ControlPanelWindowProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const isDark = isHydrated && resolvedTheme === "dark"

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
          <div className="flex gap-3">
            {PALETTES.map(({ value, label }) => (
              <Button
                key={value}
                size="sm"
                variant={palette === value ? "default" : "outline"}
                aria-pressed={palette === value}
                onClick={() => onPaletteChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-lg">
            <Checkbox
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked === true ? "dark" : "light")}
            />
            Dark mode
          </label>
        </fieldset>
        <Button variant="destructive" size="sm" className="self-start" onClick={onSpawnError}>
          Spawn error
        </Button>
      </div>
    </Window>
  )
}

export { ControlPanelWindow }
