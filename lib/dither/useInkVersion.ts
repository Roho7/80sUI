"use client"

import { useEffect, useState } from "react"

const THEME_ATTRIBUTES = ["class", "data-theme", "style"]

export function useInkVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((current) => current + 1))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTES,
    })
    return () => observer.disconnect()
  }, [])

  return version
}
