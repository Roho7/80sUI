"use client"

import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import * as React from "react"

import { useComposedRef } from "@/lib/composeRefs"
import { useEinkRefresh } from "@/lib/eink"

function Checkbox({
  className,
  ref,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const checkboxRef = React.useRef<HTMLButtonElement>(null)
  const composedRef = useComposedRef(ref, checkboxRef)
  const refresh = useEinkRefresh(checkboxRef, "partial")

  return (
    <CheckboxPrimitive.Root
      ref={composedRef}
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center border-pixel border-input bg-card text-card-foreground outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:text-muted-foreground aria-invalid:border-destructive data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      onCheckedChange={(checked) => {
        refresh()
        onCheckedChange?.(checked)
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <svg
          viewBox="0 0 7 7"
          shapeRendering="crispEdges"
          className="size-3.5 fill-current"
          aria-hidden="true"
        >
          <path d="M6 1h1v1H6zM5 2h2v1H5zM0 3h1v1H0zM4 3h2v1H4zM0 4h2v1H0zM3 4h2v1H3zM1 5h3v1H1zM2 6h1v1H2z" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
