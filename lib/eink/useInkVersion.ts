"use client"

import { useEffect, useState } from "react"

import { observeTheme } from "./observeTheme"
import { useEink } from "./useEink"

export function useInkVersion(): number {
  const { engine } = useEink()
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const bumpVersion = () => setVersion((current) => current + 1)
    return engine ? engine.subscribeInks(bumpVersion) : observeTheme(bumpVersion)
  }, [engine])

  return version
}
