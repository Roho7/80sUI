"use client"

import { cn } from "cn"
import { Separator as SeparatorPrimitive } from "radix-ui"
import * as React from "react"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 border-bevel-lo data-horizontal:w-full data-horizontal:border-t-(length:--pixel) data-horizontal:border-b-(length:--pixel) data-horizontal:border-b-bevel-hi data-vertical:self-stretch data-vertical:border-l-(length:--pixel) data-vertical:border-r-(length:--pixel) data-vertical:border-r-bevel-hi",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
