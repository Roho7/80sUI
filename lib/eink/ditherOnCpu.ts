import { readBayerThreshold } from "./bayer"
import { type DitherRequest, readSeedOffset } from "./ditherRenderer"
import type { InkPalette } from "./types"

let sampleCanvas: HTMLCanvasElement | null = null

function readSampleContext(width: number, height: number) {
  sampleCanvas ??= document.createElement("canvas")
  sampleCanvas.width = width
  sampleCanvas.height = height
  return sampleCanvas.getContext("2d", { willReadFrequently: true })
}

export function ditherOnCpu(
  request: DitherRequest,
  inks: InkPalette
): ImageData | null {
  const { width, height, source, matrixSize, contrast } = request
  const context = readSampleContext(width, height)
  if (!context) {
    return null
  }
  context.drawImage(source, 0, 0, width, height)
  const image = context.getImageData(0, 0, width, height)
  const [offsetX, offsetY] = readSeedOffset(request.seed)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const luminance =
        (image.data[offset] * 0.2126 +
          image.data[offset + 1] * 0.7152 +
          image.data[offset + 2] * 0.0722) /
        255
      const contrasted = Math.min(1, Math.max(0, (luminance - 0.5) * contrast + 0.5))
      const threshold = readBayerThreshold(x + offsetX, y + offsetY, matrixSize)
      const ink = inks[Math.min(3, Math.max(0, Math.floor(contrasted * 3 + threshold)))]
      image.data[offset] = ink[0]
      image.data[offset + 1] = ink[1]
      image.data[offset + 2] = ink[2]
      image.data[offset + 3] = 255
    }
  }
  return image
}
