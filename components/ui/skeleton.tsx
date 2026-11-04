"use client"

import { cn } from "cn"
import * as React from "react"

import { observeInkChange, parseCssColor } from "@/lib/dither/inks"

const FRAME_MS = 100
const DENSITY_LOW = 0.08
const DENSITY_HIGH = 0.62

type Surface = {
  element: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  pixel: number
  back: number
  front: number
}

const surfaces = new Set<Surface>()
let timerId: number | null = null
let stopObservingInks: (() => void) | null = null
let startTime = 0

function hash(x: number, y: number): number {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function readValueNoise(x: number, y: number): number {
  const cellX = Math.floor(x)
  const cellY = Math.floor(y)
  const fractionX = x - cellX
  const fractionY = y - cellY
  const easeX = fractionX * fractionX * (3 - 2 * fractionX)
  const easeY = fractionY * fractionY * (3 - 2 * fractionY)
  const top = hash(cellX, cellY) + (hash(cellX + 1, cellY) - hash(cellX, cellY)) * easeX
  const bottom = hash(cellX, cellY + 1) + (hash(cellX + 1, cellY + 1) - hash(cellX, cellY + 1)) * easeX
  return top + (bottom - top) * easeY
}

function readDensity(x: number, y: number, time: number): number {
  const u = x / 22
  const v = y / 14
  const warpX = readValueNoise(u * 0.7 + time * 0.18, v * 0.7 - time * 0.07)
  const warpY = readValueNoise(u * 0.7 - time * 0.11 + 5.2, v * 0.7 + time * 0.13 + 1.3)
  const flow = readValueNoise(u + warpX * 2.4 - time * 0.3, v + warpY * 2.4)
  const fine = readValueNoise(u * 2.3 + time * 0.45, v * 2.3)
  const level = Math.min(Math.max((flow * 0.75 + fine * 0.25 - 0.22) * 1.9, 0), 1)
  return DENSITY_LOW + level * (DENSITY_HIGH - DENSITY_LOW)
}

function readBayer4(x: number, y: number): number {
  const fine = ((x & 1) * 2 + (y & 1) * 3) & 3
  const coarse = (((x >> 1) & 1) * 2 + ((y >> 1) & 1) * 3) & 3
  return (fine * 4 + coarse + 0.5) / 16
}

function packColor(value: string): number {
  const [red, green, blue, alpha] = parseCssColor(value)
  return ((alpha << 24) | (blue << 16) | (green << 8) | red) >>> 0
}

function readTheme(surface: Surface) {
  const style = getComputedStyle(surface.element)
  const token = parseFloat(style.getPropertyValue("--pixel"))
  surface.pixel = Number.isFinite(token) && token > 0 ? token : 2
  surface.back = packColor(style.getPropertyValue("--muted").trim())
  surface.front = packColor(style.getPropertyValue("--muted-foreground").trim())
}

function paint(surface: Surface, time: number) {
  const rect = surface.element.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return
  }
  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
    return
  }
  const { canvas, context, pixel } = surface
  const columns = Math.ceil(rect.width / pixel)
  const rows = Math.ceil(rect.height / pixel)
  if (canvas.width !== columns || canvas.height !== rows) {
    canvas.width = columns
    canvas.height = rows
    canvas.style.width = `${columns * pixel}px`
    canvas.style.height = `${rows * pixel}px`
  }
  const originX = Math.round((rect.left + window.scrollX) / pixel)
  const originY = Math.round((rect.top + window.scrollY) / pixel)
  const image = context.createImageData(columns, rows)
  const out = new Uint32Array(image.data.buffer)
  for (let row = 0; row < rows; row += 1) {
    const worldY = originY + row
    for (let column = 0; column < columns; column += 1) {
      const worldX = originX + column
      const isFront = readDensity(worldX, worldY, time) > readBayer4(worldX, worldY)
      out[row * columns + column] = isFront ? surface.front : surface.back
    }
  }
  context.putImageData(image, 0, 0)
}

function isReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function readTime(): number {
  return isReducedMotion() ? 0 : (performance.now() - startTime) / 1000
}

function paintAll() {
  if (document.hidden) {
    return
  }
  const time = Math.floor(readTime() * (1000 / FRAME_MS)) * (FRAME_MS / 1000)
  for (const surface of surfaces) {
    paint(surface, time)
  }
}

function refreshTheme() {
  for (const surface of surfaces) {
    readTheme(surface)
  }
  paintAll()
}

function attachSurface(element: HTMLElement, canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext("2d")
  if (!context) {
    return () => {}
  }
  const surface: Surface = { element, canvas, context, pixel: 2, back: 0, front: 0 }
  readTheme(surface)
  if (surfaces.size === 0) {
    startTime = performance.now()
    stopObservingInks = observeInkChange(refreshTheme)
    if (!isReducedMotion()) {
      timerId = window.setInterval(paintAll, FRAME_MS)
    }
  }
  surfaces.add(surface)
  paint(surface, readTime())
  const resizeObserver = new ResizeObserver(() => paint(surface, readTime()))
  resizeObserver.observe(element)
  return () => {
    resizeObserver.disconnect()
    surfaces.delete(surface)
    if (surfaces.size === 0) {
      if (timerId !== null) {
        window.clearInterval(timerId)
        timerId = null
      }
      stopObservingInks?.()
      stopObservingInks = null
    }
  }
}

function Skeleton({ className, children, ...props }: React.ComponentProps<"div">) {
  const elementRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    const canvas = canvasRef.current
    if (!element || !canvas) {
      return
    }
    return attachSurface(element, canvas)
  }, [])

  return (
    <div
      ref={elementRef}
      data-slot="skeleton"
      className={cn("relative overflow-hidden bg-muted", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 pixelated"
      />
      {children}
    </div>
  )
}

export { Skeleton }
