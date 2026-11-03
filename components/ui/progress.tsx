"use client"

import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { useComposedRef } from "@/lib/composeRefs"
import { useEinkRefresh } from "@/lib/eink"

function Progress({
  className,
  value,
  ref,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const progressRef = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRef(ref, progressRef)
  const refresh = useEinkRefresh(progressRef, "partial")
  const percent = Math.min(100, Math.max(0, value ?? 0))

  React.useEffect(() => {
    refresh()
  }, [percent, refresh])

  return (
    <ProgressPrimitive.Root
      ref={composedRef}
      data-slot="progress"
      value={value}
      className={cn(
        "relative flex h-7 w-full items-center overflow-hidden border-pixel border-border bg-card p-(--pixel)",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full bg-foreground segments"
        style={{ width: `${percent}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
