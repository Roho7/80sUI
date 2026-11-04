"use client"

import { cn } from "cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import * as React from "react"

import { RadioDotGlyph, RadioRingGlyph } from "@/components/ui/pixel-glyphs"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative grid size-5 shrink-0 place-items-center text-foreground after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:text-muted-foreground aria-invalid:text-destructive",
        className
      )}
      {...props}
    >
      <RadioRingGlyph className="col-start-1 row-start-1" />
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="col-start-1 row-start-1 grid place-items-center text-card-foreground group-disabled/radio-group-item:text-muted-foreground"
      >
        <RadioDotGlyph />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
