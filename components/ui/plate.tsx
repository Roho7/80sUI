import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

const plateVariants = cva("pixel-border border-border", {
  variants: {
    variant: {
      raised:
        "bg-card px-3 py-2 text-card-foreground shadow-[inset_var(--pixel)_var(--pixel)_0_0_var(--bevel-glint),inset_calc(var(--pixel)*-1)_calc(var(--pixel)*-1)_0_0_var(--bevel-lo),var(--pixel)_var(--pixel)_0_0_var(--foreground)]",
      sunken:
        "bg-(--ink-1) px-3 py-2 text-(--ink-3) shadow-[inset_var(--pixel)_var(--pixel)_0_0_var(--ink-0),var(--pixel)_var(--pixel)_0_0_var(--bevel-shade)] dark:bg-(--ink-0) dark:shadow-[inset_var(--pixel)_var(--pixel)_0_0_var(--ink-2),var(--pixel)_var(--pixel)_0_0_var(--bevel-shade)]",
      tag: "bg-titlebar px-2 py-1 font-pixel text-[16px] leading-none text-titlebar-foreground uppercase",
    },
  },
  defaultVariants: {
    variant: "raised",
  },
})

function Plate({
  className,
  variant = "raised",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof plateVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="plate"
      data-variant={variant}
      className={cn(plateVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Plate, plateVariants }
