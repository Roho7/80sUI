"use client"

import { useCallback, useSyncExternalStore } from "react"

import type { SoundEntry, SoundsConfig } from "@/lib/sound/types"

import { defaultBank } from "./sound-bank"

const STORAGE_KEY = "nostalgui:sound-lab:bank:v2"

function readStored(): SoundsConfig {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultBank
    }
    const parsed = JSON.parse(raw) as Partial<SoundsConfig>
    const sounds = { ...defaultBank.sounds }
    for (const [key, entry] of Object.entries(parsed.sounds ?? {})) {
      if (key in sounds) {
        sounds[key] = entry
      }
    }
    return { ...defaultBank, sounds }
  } catch {
    return defaultBank
  }
}

export type SoundBankApi = {
  bank: SoundsConfig
  setSound: (key: string, entry: SoundEntry) => void
  resetSound: (key: string) => void
  resetAll: () => void
  isEdited: (key: string) => boolean
  editedKeys: () => string[]
  save: (keys: string[]) => Promise<string>
}

function normalize(value: unknown): string {
  return JSON.stringify(value, (key, item: unknown) => {
    if (key === "note") {
      return undefined
    }
    return typeof item === "number" ? Number(item.toPrecision(6)) : item
  })
}

let current: SoundsConfig | null = null
const listeners = new Set<() => void>()

function readSnapshot(): SoundsConfig {
  if (current === null) {
    current = readStored()
  }
  return current
}

function readServerSnapshot(): SoundsConfig {
  return defaultBank
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function persist(bank: SoundsConfig, skip: Set<string> = new Set()) {
  const sounds = Object.fromEntries(
    Object.entries(bank.sounds).filter(([key, entry]) => !skip.has(key) && normalize(entry) !== normalize(defaultBank.sounds[key])),
  )
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sounds }))
}

async function saveToFile(bank: SoundsConfig, keys: string[]): Promise<string> {
  const sounds = Object.fromEntries(keys.map((key) => [key, bank.sounds[key]]))
  const response = await fetch("/sound-lab/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sounds }),
  })
  const result = (await response.json()) as { saved?: string[]; error?: string }
  if (!response.ok || !result.saved) {
    throw new Error(result.error ?? `save failed with ${response.status}`)
  }
  persist(bank, new Set(result.saved))
  return `saved ${result.saved.length} to sounds.json`
}

function writeBank(update: (bank: SoundsConfig) => SoundsConfig) {
  current = update(readSnapshot())
  persist(current)
  for (const listener of listeners) {
    listener()
  }
}

export function useSoundBank(): SoundBankApi {
  const bank = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot)

  const setSound = useCallback((key: string, entry: SoundEntry) => {
    writeBank((value) => ({ ...value, sounds: { ...value.sounds, [key]: entry } }))
  }, [])

  return {
    bank,
    setSound,
    resetSound: (key) => setSound(key, defaultBank.sounds[key]),
    resetAll: () => writeBank(() => defaultBank),
    isEdited: (key) => normalize(bank.sounds[key]) !== normalize(defaultBank.sounds[key]),
    editedKeys: () => Object.keys(bank.sounds).filter((key) => normalize(bank.sounds[key]) !== normalize(defaultBank.sounds[key])),
    save: (keys) => saveToFile(bank, keys),
  }
}
