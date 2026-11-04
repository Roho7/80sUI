"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

import { DitherShine } from "@/components/ui/dither-shine"
import { defaultPreset, type DitherShineParams } from "@/lib/shaders/dither-shine"

const TILT_LEVELS = 2

const TILT_REST = 1

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const ctaButtonVariants = cva(
  "group/cta-button relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden pixel-border border-border bg-primary font-pixel text-[16px] leading-none whitespace-nowrap text-primary-foreground uppercase outline-none select-none [--tilt-x:1] [--tilt-y:1] translate-x-[calc((var(--tilt-x)-1)*var(--pixel))] translate-y-[calc((var(--tilt-y)-1)*var(--pixel))] [box-shadow:calc((3-var(--tilt-x))*var(--pixel))_calc((3-var(--tilt-y))*var(--pixel))_0_0_var(--foreground)] focus-visible:outline-solid active:translate-x-[calc(var(--pixel)*2)] active:translate-y-[calc(var(--pixel)*2)] active:[box-shadow:none] disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

type CtaButtonShine = Partial<DitherShineParams>

type CtaButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof ctaButtonVariants> & {
    asChild?: boolean
    isShining?: boolean
    shine?: CtaButtonShine
  }

type TiltTarget = {
  element: HTMLElement | null
  x: number
  y: number
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

function quantizeTilt(value: number): number {
  return Math.round(Math.max(-1, Math.min(1, value)) * TILT_LEVELS) / TILT_LEVELS
}

function applyTilt(element: HTMLElement, x: number, y: number) {
  element.style.setProperty("--tilt-x", String(x))
  element.style.setProperty("--tilt-y", String(y))
}

function useSteppedTilt(fps: number) {
  const targetRef = React.useRef<TiltTarget>({ element: null, x: TILT_REST, y: TILT_REST })
  const timerRef = React.useRef(0)

  React.useEffect(() => () => window.clearInterval(timerRef.current), [])

  const startTilt = React.useCallback(
    (element: HTMLElement) => {
      targetRef.current.element = element
      window.clearInterval(timerRef.current)
      timerRef.current = window.setInterval(() => {
        const target = targetRef.current
        if (target.element === null) {
          return
        }
        applyTilt(target.element, target.x, target.y)
        if (target.x === TILT_REST && target.y === TILT_REST) {
          window.clearInterval(timerRef.current)
        }
      }, 1000 / fps)
    },
    [fps]
  )

  const aimTilt = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) {
      return
    }
    targetRef.current.x = quantizeTilt(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    targetRef.current.y = quantizeTilt(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }, [])

  const releaseTilt = React.useCallback(() => {
    targetRef.current.x = TILT_REST
    targetRef.current.y = TILT_REST
  }, [])

  return { startTilt, aimTilt, releaseTilt }
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
  const { startTilt, aimTilt, releaseTilt } = useSteppedTilt(shine?.fps ?? defaultPreset.params.fps)

  return (
    <Comp
      data-slot="cta-button"
      data-size={size}
      disabled={disabled}
      className={cn(ctaButtonVariants({ size }), className)}
      onPointerEnter={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event)
        if (prefersReducedMotion) {
          return
        }
        aimTilt(event)
        startTilt(event.currentTarget)
      }}
      onPointerMove={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerMove?.(event)
        if (prefersReducedMotion) {
          return
        }
        aimTilt(event)
      }}
      onPointerLeave={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event)
        releaseTilt()
      }}
      {...props}
    >
      {shouldShine && (
        <DitherShine aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20" {...shine} />
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
