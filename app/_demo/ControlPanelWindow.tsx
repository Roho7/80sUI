"use client"

import { useTheme } from "next-themes"

import { Window, type WindowProps } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EINK_INTENSITIES, readViewportRect, useEink } from "@/lib/eink"

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
  const { engine, intensity, isReducedMotion, setIntensity } = useEink()
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const isDark = isHydrated && resolvedTheme === "dark"

  return (
    <Window
      title="Control Panel"
      defaultPosition={{ x: 900, y: 470 }}
      className="w-[340px]"
      statusBar={<span>{isReducedMotion ? "Reduced motion: e-ink off" : `E-ink: ${intensity}`}</span>}
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
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-pixel text-[16px] uppercase">E-ink</legend>
          <div className="flex gap-3">
            {EINK_INTENSITIES.map((value) => (
              <Button
                key={value}
                size="sm"
                variant={intensity === value ? "default" : "outline"}
                aria-pressed={intensity === value}
                disabled={isReducedMotion}
                onClick={() => setIntensity(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </fieldset>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => engine?.requestRefreshRect(readViewportRect(), "full")}
          >
            Full refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={onSpawnError}>
            Spawn error
          </Button>
        </div>
      </div>
    </Window>
  )
}

export { ControlPanelWindow }
