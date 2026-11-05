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

const START_LOGO_PATH =
  "M7 0h2v9H7zM12 0h2v9h-2zM9 1h1v2H9zM10 3h1v3h-1zM11 6h1v2h-1zM5 0h1v2H5zM5 3h1v2H5zM5 6h1v2H5zM3 1h1v1H3zM3 3h1v1H3zM3 5h1v1H3zM3 7h1v1H3zM1 2h1v1H1zM1 5h1v1H1z"

function StartLogoGlyph({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 14 9"
      width={28}
      height={18}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-auto shrink-0 fill-current", className)}
      {...props}
    >
      <path d={START_LOGO_PATH} />
    </svg>
  )
}

export { LogoGlyph, StartLogoGlyph }
