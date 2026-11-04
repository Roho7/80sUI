import { cn } from "cn"
import * as React from "react"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full pixel-border border-border well px-2 py-1.5 text-xl leading-tight placeholder:text-well-muted disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-dashed aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
