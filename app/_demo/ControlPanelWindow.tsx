"use client"

import { useTheme } from "next-themes"
import type * as React from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSoundEnabled } from "@/hooks/use-sound"

import { isPalette, PALETTES } from "../_site/palettes"
import { useCrt } from "../_site/useCrt"
import { useIsHydrated } from "../_site/useIsHydrated"
import { usePalette } from "../_site/usePalette"
import type { DesktopWindowProps } from "./types"

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex w-fit cursor-default items-center gap-2 text-lg leading-none">
      {children}
      {label}
    </label>
  )
}

function ControlPanelWindow({ onClose, ...windowProps }: DesktopWindowProps) {
  const [palette, setPalette] = usePalette()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = useIsHydrated() && resolvedTheme === "dark"
  const [isSoundOn, setSoundOn] = useSoundEnabled()
  const [isCrtOn, setCrtOn] = useCrt()

  return (
    <Window {...windowProps} onClose={onClose}>
      <div className="flex flex-col gap-4 p-4">
        <label className="flex items-center gap-3 text-lg leading-none">
          Scheme:
          <Select
            value={palette}
            onValueChange={(value) => {
              if (isPalette(value)) setPalette(value)
            }}
          >
            <SelectTrigger size="sm" className="flex-1">
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
        </label>
        <SettingRow label="Dark mode">
          <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
        </SettingRow>
        <SettingRow label="CRT monitor effect">
          <Switch checked={isCrtOn} onCheckedChange={setCrtOn} />
        </SettingRow>
        <SettingRow label="Enable system sounds">
          <Checkbox checked={isSoundOn} onCheckedChange={(state) => setSoundOn(state === true)} />
        </SettingRow>
        <Button size="sm" className="min-w-20 self-end" onClick={onClose}>
          OK
        </Button>
      </div>
    </Window>
  )
}

export { ControlPanelWindow }
