"use client"

import { useCallback, useSyncExternalStore } from "react"

import { DEFAULT_PALETTE, isPalette, type Palette } from "./palettes"

function subscribePalette(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })
  return () => observer.disconnect()
}

function readPalette(): Palette {
  const value = document.documentElement.dataset.theme
  return isPalette(value) ? value : DEFAULT_PALETTE
}

function readServerPalette(): Palette {
  return DEFAULT_PALETTE
}

export function usePalette(): readonly [Palette, (palette: Palette) => void] {
  const palette = useSyncExternalStore(subscribePalette, readPalette, readServerPalette)
  const setPalette = useCallback((next: Palette) => {
    document.documentElement.dataset.theme = next
  }, [])
  return [palette, setPalette]
}
