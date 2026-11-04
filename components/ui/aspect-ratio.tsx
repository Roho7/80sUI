"use client"

import { cn } from "cn"
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"
import * as React from "react"

function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn("pixel-border border-border bg-muted", className)}
      {...props}
    />
  )
}

export { AspectRatio }
