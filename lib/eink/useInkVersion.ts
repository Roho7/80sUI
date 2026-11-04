"use client"

import { useEffect, useState } from "react"

import { observeTheme } from "./observeTheme"

export function useInkVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => observeTheme(() => setVersion((current) => current + 1)), [])

  return version
}
