export type Rgb = readonly [number, number, number]

export type InkPalette = readonly [Rgb, Rgb, Rgb, Rgb]

const INK_TOKENS = ["--ink-0", "--ink-1", "--ink-2", "--ink-3"] as const

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

function parseCssColor(value: string): Rgb {
  const probe = readColorProbe()
  if (!probe || value === "") {
    return [0, 0, 0]
  }
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#000000"
  probe.fillStyle = value
  probe.fillRect(0, 0, 1, 1)
  const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}

export function readInks(root: Element): InkPalette {
  const style = getComputedStyle(root)
  const [ink0, ink1, ink2, ink3] = INK_TOKENS.map((token) =>
    parseCssColor(style.getPropertyValue(token).trim())
  )
  return [ink0, ink1, ink2, ink3]
}
