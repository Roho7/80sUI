"use client"

import { cn } from "cn"
import * as React from "react"

import { ShaderMount } from "@/components/ui/shader-mount"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { type BarrelMap, createBarrelMap } from "@/lib/crt/warp-filter"
import {
  crtFragmentShader,
  type CrtParams,
  type CrtPresetName,
  defaultCrtPreset,
  resolveCrtParams,
  toCrtUniforms,
} from "@/lib/shaders/crt"

const NO_COLORS = {}

const BLOOM_BLUR = 6

const BLOOM_GAIN = 1.2

const FULLSCREEN_OVERLAY_CLASS = "fixed inset-0 z-[2147483647]"

const VIEWPORT_PROBE_CLASS = "pointer-events-none invisible fixed inset-x-0 top-0 h-lvh"

const CHANNELS = [
  { name: "red", matrix: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", direction: -1 },
  { name: "green", matrix: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", direction: 0 },
  { name: "blue", matrix: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", direction: 1 },
] as const

type CrtScreenProps = React.ComponentProps<"div"> &
  Partial<CrtParams> & {
    preset?: CrtPresetName
    fullscreen?: boolean
  }

type Size = { width: number; height: number }

type Warp = { id: string; defs: React.ReactNode }

function subscribeNothing(): () => void {
  return () => {}
}

function readRootElement(): HTMLElement {
  return document.documentElement
}

function readServerElement(): null {
  return null
}

function useElementSize(element: HTMLElement | null): Size | null {
  const [size, setSize] = React.useState<Size | null>(null)
  React.useEffect(() => {
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { offsetWidth, offsetHeight } = element
        setSize((previous) =>
          previous?.width === offsetWidth && previous.height === offsetHeight
            ? previous
            : { width: offsetWidth, height: offsetHeight }
        )
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return size
}

function useCrtWarp(
  target: HTMLElement | null,
  size: Size | null,
  curvature: number,
  aberration: number,
  bloom: number
): Warp | null {
  const id = `crt-warp-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const isWarped = curvature > 0 || aberration > 0 || bloom > 0
  const width = size?.width ?? 0
  const height = size?.height ?? 0
  const map = React.useMemo<BarrelMap | null>(
    () => (curvature > 0 && width > 0 && height > 0 ? createBarrelMap(width, height, curvature) : null),
    [curvature, width, height]
  )
  const isReady = isWarped && target !== null && width > 0 && height > 0 && (curvature <= 0 || map !== null)

  React.useEffect(() => {
    if (!target || !isReady) {
      return
    }
    const previous = target.style.getPropertyValue("filter")
    target.style.setProperty("filter", `url(#${id})`)
    return () => {
      target.style.setProperty("filter", previous)
    }
  }, [target, isReady, id])

  if (!isReady) {
    return null
  }
  const warped = map ? "warped" : "SourceGraphic"
  const split = aberration > 0 ? "split" : warped
  const gain = bloom * BLOOM_GAIN
  return {
    id,
    defs: (
      <filter
        id={id}
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={width}
        height={height}
        colorInterpolationFilters="sRGB"
      >
        {map && (
          <>
            <feImage
              href={map.href}
              x={0}
              y={0}
              width={width}
              height={height}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={map.scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />
          </>
        )}
        {aberration > 0 &&
          CHANNELS.map(({ name, matrix, direction }) => (
            <React.Fragment key={name}>
              <feColorMatrix in={warped} type="matrix" values={matrix} result={`${name}-channel`} />
              <feOffset in={`${name}-channel`} dx={direction * aberration} dy={0} result={`${name}-shifted`} />
            </React.Fragment>
          ))}
        {aberration > 0 && (
          <>
            <feBlend in="red-shifted" in2="green-shifted" mode="screen" result="red-green" />
            <feBlend in="red-green" in2="blue-shifted" mode="screen" result="split" />
          </>
        )}
        {bloom > 0 && (
          <>
            <feGaussianBlur in={split} stdDeviation={BLOOM_BLUR * bloom} result="halo" />
            <feColorMatrix
              in="halo"
              type="matrix"
              values={`${gain} 0 0 0 0  0 ${gain} 0 0 0  0 0 ${gain} 0 0  0 0 0 1 0`}
              result="glow"
            />
            <feBlend in="glow" in2={split} mode="screen" />
          </>
        )}
      </filter>
    ),
  }
}

function WarpDefs({ warp }: { warp: Warp | null }) {
  if (!warp) {
    return null
  }
  return (
    <svg aria-hidden="true" focusable="false" width={0} height={0} className="pointer-events-none absolute">
      {warp.defs}
    </svg>
  )
}

function CrtOverlay({ params, className, ...props }: { params: CrtParams } & React.ComponentProps<"div">) {
  const uniforms = React.useMemo(() => toCrtUniforms(params), [params])
  return (
    <ShaderMount
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      {...props}
      speed={params.speed}
      frame={params.frame}
      fps={params.fps}
      fragmentShader={crtFragmentShader}
      uniforms={uniforms}
      colors={NO_COLORS}
    />
  )
}

function useCrtParams(props: Partial<CrtParams>, preset: CrtPresetName): CrtParams {
  const isReducedMotion = usePrefersReducedMotion()
  const { speed, frame, fps, scanlines, scanlineDensity, noise, vignette, mask, flicker, bloom, curvature, aberration, roll } = props
  return React.useMemo(
    () =>
      resolveCrtParams(
        preset,
        { speed, frame, fps, scanlines, scanlineDensity, noise, vignette, mask, flicker, bloom, curvature, aberration, roll },
        isReducedMotion
      ),
    [preset, isReducedMotion, speed, frame, fps, scanlines, scanlineDensity, noise, vignette, mask, flicker, bloom, curvature, aberration, roll]
  )
}

function FullscreenCrt({
  params,
  children,
  ...props
}: { params: CrtParams } & React.ComponentProps<"div">) {
  const root = React.useSyncExternalStore(subscribeNothing, readRootElement, readServerElement)
  const [probe, setProbe] = React.useState<HTMLDivElement | null>(null)
  const viewport = useElementSize(probe)
  const warp = useCrtWarp(root, viewport, params.curvature, params.aberration, params.bloom)
  return (
    <>
      <div ref={setProbe} aria-hidden="true" className={VIEWPORT_PROBE_CLASS} />
      <WarpDefs warp={warp} />
      {children}
      <CrtOverlay data-slot="crt-screen" data-fullscreen="" params={params} {...props} className={cn(FULLSCREEN_OVERLAY_CLASS, props.className)} />
    </>
  )
}

function ScopedCrt({
  params,
  className,
  children,
  ...props
}: { params: CrtParams } & React.ComponentProps<"div">) {
  const [content, setContent] = React.useState<HTMLDivElement | null>(null)
  const size = useElementSize(content)
  const warp = useCrtWarp(content, size, params.curvature, params.aberration, params.bloom)
  return (
    <div data-slot="crt-screen" className={cn("relative isolate", className)} {...props}>
      <WarpDefs warp={warp} />
      <div ref={setContent} data-slot="crt-screen-content" className="size-full">
        {children}
      </div>
      <CrtOverlay params={params} className="absolute inset-0 z-10" />
    </div>
  )
}

function CrtScreen({
  preset = defaultCrtPreset,
  fullscreen = false,
  speed,
  frame,
  fps,
  scanlines,
  scanlineDensity,
  noise,
  vignette,
  mask,
  flicker,
  bloom,
  curvature,
  aberration,
  roll,
  ...props
}: CrtScreenProps) {
  const params = useCrtParams(
    { speed, frame, fps, scanlines, scanlineDensity, noise, vignette, mask, flicker, bloom, curvature, aberration, roll },
    preset
  )
  return fullscreen ? <FullscreenCrt params={params} {...props} /> : <ScopedCrt params={params} {...props} />
}

export { CrtScreen }
export type { CrtScreenProps }
