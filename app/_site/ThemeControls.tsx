"use client"

import { Moon, Sun, Volume3, VolumeX } from "@nsmr/pixelart-react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSoundEnabled } from "@/hooks/use-sound"

import { isPalette, PALETTES } from "./palettes"
import { useIsHydrated } from "./useIsHydrated"
import { usePalette } from "./usePalette"

type ThemeControlsProps = {
  className?: string
}

function ThemeControls({ className }: ThemeControlsProps) {
  const [palette, setPalette] = usePalette()
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const isDark = isHydrated && resolvedTheme === "dark"
  const [isSoundOn, setSoundOn] = useSoundEnabled()
  const ThemeIcon = isDark ? Moon : Sun
  const SoundIcon = isSoundOn ? Volume3 : VolumeX

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <Select
        value={palette}
        onValueChange={(value) => {
          if (isPalette(value)) setPalette(value)
        }}
      >
        <SelectTrigger size="sm" aria-label="Palette">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PALETTES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="flex items-center gap-2" title={isDark ? "Dark mode" : "Light mode"}>
        <ThemeIcon size={20} className="fill-current" aria-hidden="true" />
        <Switch
          aria-label="Dark mode"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </label>
      <label className="flex items-center gap-2" title={isSoundOn ? "Sound on" : "Sound off"}>
        <SoundIcon size={20} className="fill-current" aria-hidden="true" />
        <Switch aria-label="Sound" checked={isSoundOn} onCheckedChange={setSoundOn} />
      </label>
    </div>
  )
}

export { ThemeControls }
