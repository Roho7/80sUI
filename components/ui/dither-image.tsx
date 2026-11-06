"use client"

import { cn } from "cn"
import * as React from "react"

import type { BayerMatrixSize } from "@/lib/dither/bayer"
import { ditherOnCpu, type DitherRequest } from "@/lib/dither/ditherOnCpu"
import { INK_TOKENS, readInks } from "@/lib/dither/inks"
import { useInkVersion } from "@/lib/dither/useInkVersion"

type DitherImageColors =
  | readonly [string, string]
  | readonly [string, string, string]
  | readonly [string, string, string, string]

type DitherImageProps = Omit<
  React.ComponentProps<"canvas">,
  "width" | "height" | "children"
> & {
  src: string
  alt: string
  width: number
  height: number
  pixelSize?: number
  matrixSize?: BayerMatrixSize
  contrast?: number
  isAnimated?: boolean
  colors?: DitherImageColors
}

const COLOR_TOKENS = ["--dither-ink-0", "--dither-ink-1", "--dither-ink-2", "--dither-ink-3"] as const

function toCssColor(color: string): string {
  return color.startsWith("--") ? `var(${color})` : color
}

function readColorStyle(colors: DitherImageColors | undefined): React.CSSProperties {
  if (!colors) {
    return {}
  }
  return Object.fromEntries(colors.map((color, index) => [COLOR_TOKENS[index], toCssColor(color)]))
}

function readColorTokens(colorCount: number): readonly [string, string, ...string[]] {
  if (colorCount < 2) {
    return INK_TOKENS
  }
  const [first, second, ...rest] = COLOR_TOKENS.slice(0, colorCount)
  return [first, second, ...rest]
}

function useLoadedImage(src: string): HTMLImageElement | null {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null)

  React.useEffect(() => {
    let isCurrent = true
    const loading = new Image()
    loading.src = src
    loading
      .decode()
      .then(() => {
        if (isCurrent) {
          setImage(loading)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setImage(null)
        }
      })
    return () => {
      isCurrent = false
    }
  }, [src])

  return image
}

const RESEED_FPS = 12

function useReseed(isAnimated: boolean): number {
  const [seed, setSeed] = React.useState(0)

  React.useEffect(() => {
    if (!isAnimated) {
      return
    }
    const interval = window.setInterval(
      () => setSeed((current) => current + 1),
      1000 / RESEED_FPS
    )
    return () => window.clearInterval(interval)
  }, [isAnimated])

  return seed
}

function DitherImage({
  src,
  alt,
  width,
  height,
  pixelSize = 2,
  matrixSize = 4,
  contrast = 1.2,
  isAnimated = false,
  colors,
  className,
  style,
  ...props
}: DitherImageProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const image = useLoadedImage(src)
  const inkVersion = useInkVersion()
  const seed = useReseed(isAnimated)
  const outputWidth = Math.max(1, Math.round(width / pixelSize))
  const outputHeight = Math.max(1, Math.round(height / pixelSize))
  const colorKey = colors?.join("|") ?? ""
  const colorCount = colors?.length ?? 0

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) {
      return
    }
    const request: DitherRequest = {
      source: image,
      width: outputWidth,
      height: outputHeight,
      matrixSize,
      contrast,
      seed,
    }
    const dithered = ditherOnCpu(request, readInks(canvas, readColorTokens(colorCount)))
    if (dithered) {
      canvas.getContext("2d")?.putImageData(dithered, 0, 0)
    }
  }, [image, inkVersion, seed, outputWidth, outputHeight, matrixSize, contrast, colorCount, colorKey])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      data-slot="dither-image"
      width={outputWidth}
      height={outputHeight}
      className={cn("block pixelated", className)}
      style={{ width, height, ...readColorStyle(colors), ...style }}
      {...props}
    />
  )
}

export { DitherImage }
export type { DitherImageColors, DitherImageProps }
