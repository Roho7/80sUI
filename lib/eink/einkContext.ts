"use client"

import { createContext } from "react"

import type { EinkEngine } from "./engine"
import type { EinkIntensity } from "./types"

export type EinkContextValue = {
  engine: EinkEngine | null
  intensity: EinkIntensity
  isReducedMotion: boolean
  setIntensity: (intensity: EinkIntensity) => void
}

export const EinkContext = createContext<EinkContextValue>({
  engine: null,
  intensity: "off",
  isReducedMotion: false,
  setIntensity: () => {},
})
