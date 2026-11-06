"use client"

import { Monitor, Moon, Sun, Volume3, VolumeX } from "@nsmr/pixelart-react"
import { cn } from "cn"
import { useTheme } from "next-themes"

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { useSoundEnabled } from "@/hooks/use-sound"

import { isPalette, PALETTES } from "./palettes"
import { useCrt } from "./useCrt"
import { useIsHydrated } from "./useIsHydrated"
import { usePalette } from "./usePalette"

type ThemeControlsProps = {
  className?: string
}

function useSiteDisplayPreferences() {
  const [palette, setPalette] = usePalette()
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const isDark = isHydrated && resolvedTheme === "dark"
  const [isSoundOn, setSoundOn] = useSoundEnabled()
  const [isCrtOn, setCrtOn] = useCrt()
  return {
    palette,
    setPalette,
    setTheme,
    isHydrated,
    isDark,
    isSoundOn,
    setSoundOn,
    isCrtOn,
    setCrtOn,
  }
}

function ThemeControls({ className }: ThemeControlsProps) {
  const {
    palette,
    setPalette,
    setTheme,
    isHydrated,
    isDark,
    isSoundOn,
    setSoundOn,
    isCrtOn,
    setCrtOn,
  } = useSiteDisplayPreferences()
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
        <Toggle
          aria-label="Dark mode"
          pressed={isDark}
          onPressedChange={(checked) => setTheme(checked ? "dark" : "light")}
        >
          <ThemeIcon size={20} className="fill-current" aria-hidden="true" />
        </Toggle>
      </label>
      <label className="flex items-center gap-2" title={isSoundOn ? "Sound on" : "Sound off"}>
        <Toggle aria-label="Sound" pressed={isSoundOn} onPressedChange={setSoundOn} >
          <SoundIcon size={20} className="fill-current" aria-hidden="true" />

        </Toggle>
      </label>
      <label className="flex items-center gap-2" title={isCrtOn ? "CRT on" : "CRT off"}>
        <Toggle aria-label="CRT" pressed={isCrtOn} onPressedChange={setCrtOn}>
          <Monitor size={20} className="fill-current" aria-hidden="true" />
        </Toggle>
      </label>
    </div>
  )
}

/** Single top-level menubar menu for narrow viewports — palette, theme, sound, CRT in one dropdown. */
function SiteEditMenubarMenu() {
  const {
    palette,
    setPalette,
    setTheme,
    isHydrated,
    isDark,
    isSoundOn,
    setSoundOn,
    isCrtOn,
    setCrtOn,
  } = useSiteDisplayPreferences()

  return (
    <MenubarMenu>
      <MenubarTrigger className="shrink-0">Edit</MenubarTrigger>
      <MenubarContent align="end" className="min-w-44">
        <MenubarLabel>Palette</MenubarLabel>
        <MenubarRadioGroup
          value={palette}
          onValueChange={(value) => {
            if (isPalette(value)) setPalette(value)
          }}
        >
          {PALETTES.map(({ value, label }) => (
            <MenubarRadioItem key={value} value={value}>
              {label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarCheckboxItem
          checked={isHydrated && isDark}
          disabled={!isHydrated}
          onCheckedChange={(checked) => setTheme(checked === true ? "dark" : "light")}
        >
          Dark mode
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={isSoundOn} onCheckedChange={(checked) => setSoundOn(checked === true)}>
          Sound
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={isCrtOn} onCheckedChange={(checked) => setCrtOn(checked === true)}>
          CRT monitor
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { SiteEditMenubarMenu, ThemeControls }
