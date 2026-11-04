"use client"

import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"

type ShineDensity = 0 | 25 | 50 | 75 | 100

const SHINE_SEGMENTS: readonly ShineDensity[] = [25, 50, 75, 100, 100, 75, 50, 25, 0, 0, 50, 100, 50]

const DENSITY_CLASSES: Record<ShineDensity, string> = {
  0: "bg-transparent",
  25: "bg-current dither-25",
  50: "bg-current dither-50",
  75: "bg-current dither-75",
  100: "bg-current",
}

function CtaButton({
  className,
  variant = "default",
  size = "lg",
  asChild = false,
  isShining = true,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isShining?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="cta-button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), "overflow-hidden", className)}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {isShining && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 @container motion-reduce:hidden group-disabled/button:hidden"
        >
          <span
            style={{ "--shine-width": `calc(var(--pixel) * ${SHINE_SEGMENTS.length * 2})` } as React.CSSProperties}
            className="absolute inset-y-0 left-[calc(var(--shine-width)*-1)] flex w-(--shine-width) animate-dither-shine"
          >
            {SHINE_SEGMENTS.map((density, index) => (
              <span key={index} className={cn("h-full w-[calc(var(--pixel)*2)]", DENSITY_CLASSES[density])} />
            ))}
          </span>
        </span>
      )}
    </Comp>
  )
}

export { CtaButton }
