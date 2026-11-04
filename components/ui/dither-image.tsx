"use client"

import { cn } from "cn"
import * as React from "react"

import type { BayerMatrixSize } from "@/lib/dither/bayer"
import { ditherOnCpu, type DitherRequest } from "@/lib/dither/ditherOnCpu"
import { readInks } from "@/lib/dither/inks"
import { useInkVersion } from "@/lib/dither/useInkVersion"

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
    const dithered = ditherOnCpu(request, readInks(document.documentElement))
    if (dithered) {
      canvas.getContext("2d")?.putImageData(dithered, 0, 0)
    }
  }, [image, inkVersion, seed, outputWidth, outputHeight, matrixSize, contrast])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      data-slot="dither-image"
      width={outputWidth}
      height={outputHeight}
      className={cn("block pixelated", className)}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

export { DitherImage }
