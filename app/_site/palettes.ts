export type Palette = "phosphor" | "cyan-pixel" | "retro-candy"

export const PALETTES: readonly { value: Palette; label: string }[] = [
  { value: "phosphor", label: "Phosphor" },
  { value: "cyan-pixel", label: "Cyan pixel" },
  { value: "retro-candy", label: "Retro Candy" },
]

export const DEFAULT_PALETTE: Palette = "phosphor"

export function isPalette(value: string | undefined): value is Palette {
  return PALETTES.some((palette) => palette.value === value)
}
