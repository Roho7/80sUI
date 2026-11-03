import type { InkPalette, Rgb } from "./types"

const INK_TOKENS = ["--ink-0", "--ink-1", "--ink-2", "--ink-3"] as const

const DEFAULT_FPS = 12
const DEFAULT_PIXEL = 2

let colorProbe: CanvasRenderingContext2D | null = null

function readColorProbe(): CanvasRenderingContext2D | null {
  if (colorProbe) {
    return colorProbe
  }
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  colorProbe = canvas.getContext("2d", { willReadFrequently: true })
  return colorProbe
}

export function parseCssColor(value: string): Rgb {
  const probe = readColorProbe()
  if (!probe || value.trim() === "") {
    return [0, 0, 0]
  }
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#000000"
  probe.fillStyle = value.trim()
  probe.fillRect(0, 0, 1, 1)
  const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}

function readToken(root: Element, token: string): string {
  return getComputedStyle(root).getPropertyValue(token).trim()
}

export function readInks(root: Element): InkPalette {
  const [ink0, ink1, ink2, ink3] = INK_TOKENS.map((token) =>
    parseCssColor(readToken(root, token))
  )
  return [ink0, ink1, ink2, ink3]
}

function readPositiveNumber(raw: string, fallback: number): number {
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function readFps(root: Element): number {
  return readPositiveNumber(readToken(root, "--eink-fps"), DEFAULT_FPS)
}

export function readPixel(root: Element): number {
  return readPositiveNumber(readToken(root, "--pixel"), DEFAULT_PIXEL)
}

export function areInksEqual(first: InkPalette, second: InkPalette): boolean {
  return first.every((ink, inkIndex) =>
    ink.every((channel, channelIndex) => channel === second[inkIndex][channelIndex])
  )
}
