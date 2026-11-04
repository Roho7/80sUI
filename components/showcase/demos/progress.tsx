import { useEffect, useState } from "react"

import { Progress } from "@/components/ui/progress"

import type { ShowcaseDemo } from "../types"

const VALUES = [0, 25, 50, 75, 100] as const

const LIVE_STEP = 5

const LIVE_INTERVAL_MS = 400

function LiveProgress() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(
      () => setValue((current) => (current >= 100 ? 0 : current + LIVE_STEP)),
      LIVE_INTERVAL_MS
    )
    return () => window.clearInterval(interval)
  }, [])

  return <Progress value={value} aria-label="Live progress" />
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    ...VALUES.map((value) => ({
      label: `${value}%`,
      render: () => <Progress value={value} aria-label={`${value} percent`} />,
    })),
    { label: "live", render: () => <LiveProgress /> },
  ],
}
