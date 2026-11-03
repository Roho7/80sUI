"use client"

import { type RefObject, useCallback } from "react"

import type { RefreshKind } from "./types"
import { useEink } from "./useEink"

export function useEinkRefresh(
  ref: RefObject<Element | null>,
  kind: RefreshKind
): () => void {
  const { engine } = useEink()
  return useCallback(() => {
    const element = ref.current
    if (element) {
      engine?.requestRefresh(element, kind)
    }
  }, [engine, ref, kind])
}
