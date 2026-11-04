"use client"

import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"


function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const percent = Math.min(100, Math.max(0, value ?? 0))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative flex h-7 w-full items-center overflow-hidden pixel-border border-border bg-card p-(--pixel)",
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
