"use client"

import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"
import * as React from "react"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-stretch pixel-border border-input bg-card after:absolute after:-inset-x-3 after:-inset-y-2 aria-invalid:border-dashed aria-invalid:border-destructive data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-8 data-disabled:cursor-not-allowed data-disabled:border-muted-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-foreground dither-50 group-data-checked/switch:block group-data-disabled/switch:bg-muted-foreground"
      />
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none relative block h-full w-1/2 pixel-border border-border bg-secondary bevel-raised offset-shadow-none data-checked:translate-x-full group-data-disabled/switch:border-muted-foreground group-data-disabled/switch:bg-muted"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
