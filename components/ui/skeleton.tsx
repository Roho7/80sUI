"use client"

import { cn } from "cn"
import * as React from "react"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  const [isShifted, setIsShifted] = React.useState(false)

  React.useEffect(() => {
    const id = setInterval(() => setIsShifted((value) => !value), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted-foreground dither-25",
        isShifted
          ? "[mask-position:calc(var(--pixel)*2)_calc(var(--pixel)*2)]"
          : "[mask-position:0_0]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
