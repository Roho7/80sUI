import { cn } from "cn"
import type * as React from "react"

import { BRAND_LOGO } from "@/lib/brand/keycap"

const CELL = 2

function BrandLogo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={`0 0 ${BRAND_LOGO.width} ${BRAND_LOGO.height}`}
      width={BRAND_LOGO.width * CELL}
      height={BRAND_LOGO.height * CELL}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-auto shrink-0 translate-y-px fill-current", className)}
      {...props}
    >
      <path d={BRAND_LOGO.trail} />
      <path d={BRAND_LOGO.digits} />
    </svg>
  )
}

export { BrandLogo }
