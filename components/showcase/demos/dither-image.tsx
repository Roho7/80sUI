import { DitherImage, type DitherImageColors } from "@/components/ui/dither-image"

import type { ShowcaseDemo } from "../types"

type DitherSetting = {
  label: string
  matrixSize: 4 | 8
  pixelSize: number
  contrast: number
  isAnimated: boolean
  colors?: DitherImageColors
}

const SETTINGS: readonly DitherSetting[] = [
  { label: "bayer 4x4", matrixSize: 4, pixelSize: 2, contrast: 1.2, isAnimated: false },
  { label: "bayer 8x8", matrixSize: 8, pixelSize: 2, contrast: 1.2, isAnimated: false },
  { label: "pixel size 4", matrixSize: 4, pixelSize: 4, contrast: 1.2, isAnimated: false },
  { label: "contrast 0.8", matrixSize: 4, pixelSize: 2, contrast: 0.8, isAnimated: false },
  { label: "contrast 2.0", matrixSize: 4, pixelSize: 2, contrast: 2, isAnimated: false },
  {
    label: "custom colors",
    matrixSize: 4,
    pixelSize: 2,
    contrast: 1.2,
    isAnimated: false,
    colors: ["--ink-0", "var(--desktop)", "--ink-3"],
  },
  {
    label: "two colors",
    matrixSize: 8,
    pixelSize: 2,
    contrast: 1.2,
    isAnimated: false,
    colors: ["--ink-0", "--ink-3"],
  },
  { label: "animated reseed", matrixSize: 8, pixelSize: 2, contrast: 1.3, isAnimated: true },
]

export const demo: ShowcaseDemo = {
  span: "large",
  variants: SETTINGS.map(({ label, ...setting }) => ({
    label,
    render: () => (
      <DitherImage
        src="/eye1.png"
        alt={`Eye dithered with ${label}`}
        width={224}
        height={220}
        className="mx-auto max-w-full"
        {...setting}
      />
    ),
  })),
}
