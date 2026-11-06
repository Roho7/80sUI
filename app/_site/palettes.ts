export type Palette = "phosphor" | "cyan-pixel" | "retro-candy" | "soul-green" | "95"

export const PALETTES: readonly { value: Palette; label: string }[] = [
  { value: "phosphor", label: "Phosphor" },
  { value: "cyan-pixel", label: "Cyan Pixel" },
  { value: "retro-candy", label: "Retro Candy" },
  { value: "soul-green", label: "Soul Green" },
  { value: "95", label: "Win95" }
]

export const DEFAULT_PALETTE: Palette = "phosphor"

export function isPalette(value: string | undefined): value is Palette {
  return PALETTES.some((palette) => palette.value === value)
}
