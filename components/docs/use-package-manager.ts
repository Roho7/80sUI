"use client"

import { useCallback, useSyncExternalStore } from "react"

import {
  DEFAULT_PACKAGE_MANAGER,
  isPackageManagerName,
  type PackageManager,
  type PackageManagerName,
  readPackageManager,
} from "@/lib/docs/package-managers"

const STORAGE_KEY = "nostalgui-package-manager"

const listeners = new Set<() => void>()
let sessionChoice: PackageManagerName | null = null

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function readStoredChoice(): PackageManagerName | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isPackageManagerName(stored) ? stored : null
  } catch {
    return null
  }
}

function persistChoice(choice: PackageManagerName) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    return
  }
}

function readSnapshot(): PackageManagerName {
  return readStoredChoice() ?? sessionChoice ?? DEFAULT_PACKAGE_MANAGER
}

function readServerSnapshot(): PackageManagerName {
  return DEFAULT_PACKAGE_MANAGER
}

export function usePackageManager(): readonly [PackageManager, (name: PackageManagerName) => void] {
  const name = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot)
  const choose = useCallback((next: PackageManagerName) => {
    sessionChoice = next
    persistChoice(next)
    listeners.forEach((listener) => listener())
  }, [])
  return [readPackageManager(name), choose]
}
