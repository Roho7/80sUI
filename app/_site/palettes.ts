export type Palette = "phosphor" | "cyan-pixel" | "retro-candy" | "soul-green" | "95"

export const PALETTES: readonly { value: Palette; label: string }[] = [
  { value: "phosphor", label: "Phosphor" },
  { value: "cyan-pixel", label: "Cyan Pixel" },
  { value: "retro-candy", label: "Retro Candy" },
  { value: "soul-green", label: "Soul Green" },
  { value: "95", label: "Win95" }
]

export const DEFAULT_PALETTE: Palette = "phosphor"

export const PALETTE_STORAGE_KEY = "ui95-palette"

export const RESTORE_PALETTE_SCRIPT = `try{var p=localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});if(${JSON.stringify(PALETTES.map((palette) => palette.value))}.indexOf(p)>-1)document.documentElement.dataset.theme=p}catch(e){}`

export function isPalette(value: string | undefined): value is Palette {
  return PALETTES.some((palette) => palette.value === value)
}
