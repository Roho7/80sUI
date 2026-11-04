import { cn } from "cn"
import Link from "next/link"
import type * as React from "react"

function ProseLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("underline decoration-(length:--pixel) underline-offset-4", className)}
      {...props}
    />
  )
}

export { ProseLink }
