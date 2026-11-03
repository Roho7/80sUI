export type RefreshKind = "partial" | "region" | "full"

export type RefreshPhase = "flash" | "invert" | "noise" | "clear"

export type EinkIntensity = "off" | "subtle" | "full"

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type Rgb = readonly [number, number, number]

export type InkPalette = readonly [Rgb, Rgb, Rgb, Rgb]

export type BayerMatrixSize = 4 | 8

export type RefreshRequest = {
  rect: Rect
  kind: RefreshKind
}

export type RefreshJob = RefreshRequest & {
  phaseIndex: number
}
