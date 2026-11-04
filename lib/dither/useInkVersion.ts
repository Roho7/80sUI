"use client"

import { useEffect, useState } from "react"

import { observeInkChange } from "./inks"

export function useInkVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => observeInkChange(() => setVersion((current) => current + 1)), [])

  return version
}
