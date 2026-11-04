"use client"

import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"
import * as React from "react"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-pixel text-[16px] leading-none uppercase select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Label }
