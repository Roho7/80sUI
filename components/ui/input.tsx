import { cn } from "cn"
import * as React from "react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 pixel-border border-input bg-card px-2 text-xl leading-none text-card-foreground bevel-sunken offset-shadow-none file:mr-2 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-pixel file:text-[16px] file:text-foreground file:uppercase placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-dashed aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
