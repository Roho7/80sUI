import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden pixel-border px-1.5 font-pixel text-sm leading-none whitespace-nowrap uppercase has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-invalid:border-dashed [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-border bg-primary text-primary-foreground [a]:hover:bg-card [a]:hover:text-card-foreground",
        secondary:
          "border-border bg-secondary text-secondary-foreground bevel-raised offset-shadow-none [a]:hover:bevel-sunken",
        destructive:
          "border-dashed border-destructive bg-card text-destructive [a]:hover:bg-destructive [a]:hover:text-card",
        outline:
          "border-border bg-transparent text-foreground [a]:hover:bg-foreground [a]:hover:text-card",
        ghost:
          "border-transparent bg-transparent text-foreground hover:border-current",
        link: "border-transparent bg-transparent text-foreground decoration-[length:var(--pixel)] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
