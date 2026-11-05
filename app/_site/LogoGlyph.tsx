import { cn } from "cn"
import type * as React from "react"

const LOGO_PATH = "M0 0h1v7H0zM4 0h1v7H4zM1 1h1v2H1zM2 3h1v1H2zM3 4h1v2H3z"

function LogoGlyph({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 5 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("h-3.5 w-2.5 shrink-0 fill-current", className)}
      {...props}
    >
      <path d={LOGO_PATH} />
    </svg>
  )
}

export { LogoGlyph }
