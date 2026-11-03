import type { EinkIntensity } from "./types"

export type IntensitySetting = {
  isActive: boolean
  coverage: number
  ghostOpacity: number
}

export const INTENSITY_SETTINGS: Record<EinkIntensity, IntensitySetting> = {
  off: { isActive: false, coverage: 0, ghostOpacity: 0 },
  subtle: { isActive: true, coverage: 0.5, ghostOpacity: 0.22 },
  full: { isActive: true, coverage: 1, ghostOpacity: 0.45 },
}

export const EINK_INTENSITIES = Object.keys(
  INTENSITY_SETTINGS
) as readonly EinkIntensity[]
