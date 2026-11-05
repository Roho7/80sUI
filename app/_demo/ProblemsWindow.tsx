"use client"

import { useEffect, useState } from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import type { DesktopWindowProps } from "./types"

type ProblemsWindowProps = DesktopWindowProps & {
  onCancel: () => void
}

const STUCK_VALUES = [99, 99, 99, 98, 99, 99, 97, 99] as const

function useStuckProgress(): number {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setTick((current) => current + 1), 900)
    return () => window.clearInterval(interval)
  }, [])

  return STUCK_VALUES[tick % STUCK_VALUES.length]
}

function ProblemsWindow({ onCancel, ...windowProps }: ProblemsWindowProps) {
  const value = useStuckProgress()

  return (
    <Window
      {...windowProps}
    >
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="font-pixel text-[24px] leading-none">PROBLEMS.EXE</p>
          <p className="mt-1 text-lg uppercase">Losing focus &quot;C:/&quot; to &quot;Desktop&quot;</p>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={value} aria-label="Problems download" className="flex-1" />
          <span className="flex h-7 w-14 items-center justify-center pixel-border border-border font-pixel text-[16px]">
            {value}%
          </span>
        </div>
        <p className="text-lg uppercase">8760 hours remaining</p>
        <Button className="self-center" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Window>
  )
}

export { ProblemsWindow }
