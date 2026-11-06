"use client"

import { useCallback, useSyncExternalStore } from "react"

import { CRT_STORAGE_KEY } from "./crt"

function subscribeCrt(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-crt"] })
  return () => observer.disconnect()
}

function readCrt(): boolean {
  return document.documentElement.dataset.crt === "on"
}

function readServerCrt(): boolean {
  return false
}

export function useCrt(): readonly [boolean, (isOn: boolean) => void] {
  const isOn = useSyncExternalStore(subscribeCrt, readCrt, readServerCrt)
  const setCrt = useCallback((next: boolean) => {
    if (next) {
      document.documentElement.dataset.crt = "on"
    } else {
      delete document.documentElement.dataset.crt
    }
    window.localStorage.setItem(CRT_STORAGE_KEY, next ? "on" : "off")
  }, [])
  return [isOn, setCrt]
}
