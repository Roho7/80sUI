"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

import { useComposedRef } from "@/lib/composeRefs"
import { useEinkRefresh } from "@/lib/eink"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center pixel-border border-border font-pixel text-[16px] leading-none whitespace-nowrap uppercase outline-none select-none disabled:pointer-events-none disabled:text-muted-foreground aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground offset-shadow-2 hover:bg-foreground hover:text-card active:not-aria-[haspopup]:translate-x-[calc(var(--pixel)*2)] active:not-aria-[haspopup]:translate-y-[calc(var(--pixel)*2)] active:not-aria-[haspopup]:offset-shadow-none aria-expanded:bg-foreground aria-expanded:text-card",
        outline:
          "bg-transparent text-foreground hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground bevel-raised active:not-aria-[haspopup]:bevel-sunken aria-expanded:bevel-sunken",
        ghost:
          "border-transparent bg-transparent text-foreground hover:border-current aria-expanded:border-current",
        destructive:
          "bg-foreground text-card offset-shadow-2 hover:bg-card hover:text-card-foreground active:not-aria-[haspopup]:translate-x-[calc(var(--pixel)*2)] active:not-aria-[haspopup]:translate-y-[calc(var(--pixel)*2)] active:not-aria-[haspopup]:offset-shadow-none",
        link: "border-transparent bg-transparent text-foreground decoration-[length:var(--pixel)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-6 gap-1 px-1.5 text-[8px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-[24px]",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ref,
  onClick,
  onPointerEnter,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const composedRef = useComposedRef(ref, buttonRef)
  const refresh = useEinkRefresh(buttonRef, "partial")

  return (
    <Comp
      ref={composedRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerEnter={(event: React.PointerEvent<HTMLButtonElement>) => {
        refresh()
        onPointerEnter?.(event)
      }}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        refresh()
        onClick?.(event)
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
