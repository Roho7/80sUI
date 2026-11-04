"use client"

import { useCallback, useSyncExternalStore } from "react"

import { SoundEngine, type SoundPlayOptions } from "@/lib/sound/sound-engine"

function subscribe(listener: () => void): () => void {
  return SoundEngine.get()?.subscribe(listener) ?? (() => {})
}

function readEnabled(): boolean {
  return SoundEngine.get()?.enabled ?? false
}

function readServerEnabled(): boolean {
  return false
}

export function useSoundEnabled(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(subscribe, readEnabled, readServerEnabled)
  const setEnabled = useCallback((next: boolean) => SoundEngine.get()?.setEnabled(next), [])
  return [enabled, setEnabled]
}

export function useSound(key: string): (options?: SoundPlayOptions) => void {
  return useCallback((options?: SoundPlayOptions) => {
    SoundEngine.get()?.play(key, options)
  }, [key])
}
