"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

import { DitherShine } from "@/components/ui/dither-shine"
import { defaultPreset, type DitherShineParams } from "@/lib/shaders/dither-shine"

const TILT_LEVELS = 2

const TILT_REST = 0

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const ctaButtonVariants = cva(
  "group/cta-button relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden border-solid bg-(--keycap) font-pixel text-[16px] leading-none whitespace-nowrap text-(--keycap-foreground) uppercase outline-none select-none [--tilt-x:0] [--tilt-y:0] [--tilt-lift:0] [border-top-color:var(--keycap-wall-hi)] [border-left-color:var(--keycap-wall-hi)] [border-right-color:var(--keycap-wall-lo)] [border-bottom-color:var(--keycap-wall-lo)] [border-top-width:calc((1+var(--tilt-y)*0.5)*var(--pixel))] [border-bottom-width:calc((3+var(--tilt-lift)-var(--tilt-y)*1.5)*var(--pixel))] [border-left-width:calc((2.5+var(--tilt-x)*1.5)*var(--pixel))] [border-right-width:calc((2.5-var(--tilt-x)*1.5)*var(--pixel))] [box-shadow:0_0_0_var(--pixel)_var(--keycap-outline)] focus-visible:outline-solid focus-visible:outline-offset-[calc(var(--pixel)*2)] " +
  "active:[border-top-width:calc(var(--pixel)*2)] active:[border-bottom-width:calc(var(--pixel)*2.5)] active:[border-left-width:calc(var(--pixel)*2)] active:[border-right-width:calc(var(--pixel)*2.5)] active:[border-top-color:var(--keycap-wall-lo)] active:[border-left-color:var(--keycap-wall-lo)] active:[border-right-color:var(--keycap-wall-hi)] active:[border-bottom-color:var(--keycap-wall-hi)] " +
  "disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

type CtaButtonShine = Partial<Omit<DitherShineParams, "colorBack" | "colorFront">>

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
  lift: number
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

function applyTilt(element: HTMLElement, { x, y, lift }: Omit<TiltTarget, "element">) {
  element.style.setProperty("--tilt-x", String(x))
  element.style.setProperty("--tilt-y", String(y))
  element.style.setProperty("--tilt-lift", String(lift))
}

function useSteppedTilt(fps: number) {
  const targetRef = React.useRef<TiltTarget>({ element: null, x: TILT_REST, y: TILT_REST, lift: 0 })
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
        applyTilt(target.element, target)
        if (target.x === TILT_REST && target.y === TILT_REST && target.lift === 0) {
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
    targetRef.current.lift = 1
  }, [])

  const releaseTilt = React.useCallback(() => {
    targetRef.current.x = TILT_REST
    targetRef.current.y = TILT_REST
    targetRef.current.lift = 0
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
        <DitherShine
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          {...shine}
          colorBack="--keycap"
          colorFront="--keycap-foreground"
        />
      )}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  )
}

export { CtaButton, ctaButtonVariants }
export type { CtaButtonProps, CtaButtonShine }
