"use client"

import { cn } from "cn"
import { Slider as SliderPrimitive } from "radix-ui"
import * as React from "react"

import { useComposedRef } from "@/lib/composeRefs"
import { useEinkRefresh } from "@/lib/eink"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ref,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const sliderRef = React.useRef<HTMLSpanElement>(null)
  const composedRef = useComposedRef(ref, sliderRef)
  const refresh = useEinkRefresh(sliderRef, "partial")
  const thumbValues = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      ref={composedRef}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:text-muted-foreground data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      onValueChange={(nextValue) => {
        refresh()
        onValueChange?.(nextValue)
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden border-pixel border-input bg-card data-horizontal:h-4 data-horizontal:w-full data-vertical:h-full data-vertical:w-4"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-foreground select-none dither-50 data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbValues.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative block h-6 w-3 shrink-0 border-pixel border-border bg-secondary bevel-raised select-none after:absolute after:-inset-2 disabled:pointer-events-none data-vertical:h-3 data-vertical:w-6"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
