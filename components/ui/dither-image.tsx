"use client"

import { cn } from "cn"
import * as React from "react"

import {
  type BayerMatrixSize,
  ditherOnCpu,
  type DitherRequest,
  readInks,
  useEink,
  useInkVersion,
} from "@/lib/eink"

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

function useReseed(isAnimated: boolean, fps: number): number {
  const [seed, setSeed] = React.useState(0)

  React.useEffect(() => {
    if (!isAnimated) {
      return
    }
    const interval = window.setInterval(
      () => setSeed((current) => current + 1),
      1000 / fps
    )
    return () => window.clearInterval(interval)
  }, [isAnimated, fps])

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
  const { engine, intensity } = useEink()
  const image = useLoadedImage(src)
  const inkVersion = useInkVersion()
  const fps = engine?.readFps() ?? 12
  const seed = useReseed(isAnimated && intensity !== "off", fps)
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
    const dithered =
      engine?.renderDither(request) ??
      ditherOnCpu(request, readInks(document.documentElement))
    if (dithered) {
      canvas.getContext("2d")?.putImageData(dithered, 0, 0)
    }
  }, [engine, image, inkVersion, seed, outputWidth, outputHeight, matrixSize, contrast])

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
