"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

import { DitherShine } from "@/components/ui/dither-shine"
import { defaultPreset, type DitherShineParams } from "@/lib/shaders/dither-shine"
import type { ShaderMount } from "@/lib/shaders/shader-mount"

const HOVER_RAMP_FRAMES = 3

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const ctaButtonVariants = cva(
  "group/cta-button relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden pixel-border border-border bg-primary font-pixel text-[16px] leading-none whitespace-nowrap text-primary-foreground uppercase offset-shadow-2 outline-none select-none focus-visible:outline-solid active:translate-x-[calc(var(--pixel)*2)] active:translate-y-[calc(var(--pixel)*2)] active:offset-shadow-none disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: "h-8 gap-1.5 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 gap-2 px-4",
        lg: "h-12 gap-2 px-6 text-[24px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type CtaButtonShine = Partial<Omit<DitherShineParams, "pointer" | "hover">>

type CtaButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof ctaButtonVariants> & {
    asChild?: boolean
    isShining?: boolean
    shine?: CtaButtonShine
  }

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function readReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function readServerReducedMotion(): boolean {
  return true
}

function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribeReducedMotion, readReducedMotion, readServerReducedMotion)
}

function useShineHover(fps: number) {
  const mountRef = React.useRef<ShaderMount | null>(null)
  const rampRef = React.useRef({ level: 0, target: 0, timerId: 0 })

  React.useEffect(() => {
    const ramp = rampRef.current
    return () => window.clearInterval(ramp.timerId)
  }, [])

  const setMount = React.useCallback((mount: ShaderMount | null) => {
    mountRef.current = mount
    rampRef.current.level = 0
    mount?.setUniforms({ u_hover: 0 })
  }, [])

  const movePointer = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) {
      return
    }
    mountRef.current?.setUniforms({
      u_pointer: [
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
      ],
    })
  }, [])

  const rampHover = React.useCallback(
    (target: number) => {
      const ramp = rampRef.current
      ramp.target = target
      window.clearInterval(ramp.timerId)
      ramp.timerId = window.setInterval(() => {
        const step = 1 / HOVER_RAMP_FRAMES
        ramp.level =
          ramp.target > ramp.level
            ? Math.min(ramp.target, ramp.level + step)
            : Math.max(ramp.target, ramp.level - step)
        mountRef.current?.setUniforms({ u_hover: ramp.level })
        if (ramp.level === ramp.target) {
          window.clearInterval(ramp.timerId)
        }
      }, 1000 / fps)
    },
    [fps]
  )

  return { setMount, movePointer, rampHover }
}

function CtaButton({
  className,
  size = "default",
  asChild = false,
  isShining = true,
  shine,
  disabled,
  children,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: CtaButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldShine = isShining && !disabled && !prefersReducedMotion
  const { setMount, movePointer, rampHover } = useShineHover(shine?.fps ?? defaultPreset.params.fps)

  return (
    <Comp
      data-slot="cta-button"
      data-size={size}
      disabled={disabled}
      className={cn(ctaButtonVariants({ size }), className)}
      onPointerEnter={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event)
        movePointer(event)
        rampHover(1)
      }}
      onPointerMove={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerMove?.(event)
        movePointer(event)
      }}
      onPointerLeave={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event)
        rampHover(0)
      }}
      {...props}
    >
      {shouldShine && (
        <DitherShine
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          onMountChange={setMount}
          {...shine}
        />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bevel-raised offset-shadow-none group-active/cta-button:bevel-sunken"
      />
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  )
}

export { CtaButton, ctaButtonVariants }
export type { CtaButtonProps, CtaButtonShine }
