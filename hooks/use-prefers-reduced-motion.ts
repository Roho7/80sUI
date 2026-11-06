import * as React from "react"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function readSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function readServerSnapshot(): boolean {
  return true
}

export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot)
}
