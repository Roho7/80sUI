"use client"

import { cn } from "cn"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { PALETTES } from "./palettes"
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

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {PALETTES.map(({ value, label }) => (
        <Button
          key={value}
          size="sm"
          variant={palette === value ? "default" : "outline"}
          aria-pressed={palette === value}
          onClick={() => setPalette(value)}
        >
          {label}
        </Button>
      ))}
      <label className="flex items-center gap-2 text-lg">
        <Checkbox
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked === true ? "dark" : "light")}
        />
        Dark mode
      </label>
    </div>
  )
}

export { ThemeControls }
