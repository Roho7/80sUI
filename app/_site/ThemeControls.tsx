"use client"

import { cn } from "cn"
import { useTheme } from "next-themes"

import {
  MoonGlyph,
  SpeakerGlyph,
  SpeakerMutedGlyph,
  SunGlyph,
} from "@/components/ui/pixel-glyphs"
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
  const ThemeGlyph = isDark ? MoonGlyph : SunGlyph
  const SoundGlyph = isSoundOn ? SpeakerGlyph : SpeakerMutedGlyph

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
        <ThemeGlyph className="size-4" />
        <Switch
          aria-label="Dark mode"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </label>
      <label className="flex items-center gap-2" title={isSoundOn ? "Sound on" : "Sound off"}>
        <SoundGlyph className="size-4" />
        <Switch aria-label="Sound" checked={isSoundOn} onCheckedChange={setSoundOn} />
      </label>
    </div>
  )
}

export { ThemeControls }
