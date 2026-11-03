"use client"

import { type ReactNode, useEffect, useMemo, useState } from "react"

import { EinkContext } from "./einkContext"
import { createEinkEngine, type EinkEngine } from "./engine"
import type { EinkIntensity } from "./types"
import { usePrefersReducedMotion } from "./usePrefersReducedMotion"

export type EinkProviderProps = {
  children: ReactNode
  defaultIntensity?: EinkIntensity
}

export function EinkProvider({
  children,
  defaultIntensity = "full",
}: EinkProviderProps) {
  const [engine] = useState<EinkEngine>(createEinkEngine)
  const [intensity, setIntensity] = useState<EinkIntensity>(defaultIntensity)
  const isReducedMotion = usePrefersReducedMotion()
  const effectiveIntensity = isReducedMotion ? "off" : intensity

  useEffect(() => {
    engine.mount(document.documentElement)
    return () => engine.unmount()
  }, [engine])

  useEffect(() => {
    engine.setIntensity(effectiveIntensity)
  }, [engine, effectiveIntensity])

  const value = useMemo(
    () => ({ engine, intensity: effectiveIntensity, isReducedMotion, setIntensity }),
    [engine, effectiveIntensity, isReducedMotion]
  )

  return <EinkContext value={value}>{children}</EinkContext>
}
