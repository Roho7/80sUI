export type Rgb = readonly [number, number, number]

export type Rgba = readonly [number, number, number, number]

export type InkPalette = readonly [Rgb, Rgb, Rgb, Rgb]

const INK_TOKENS = ["--ink-0", "--ink-1", "--ink-2", "--ink-3"] as const

const THEME_ATTRIBUTES = ["class", "data-theme", "style"]

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

export function parseCssColor(value: string): Rgba {
  const probe = readColorProbe()
  if (!probe || value === "") {
    return [0, 0, 0, 255]
  }
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#000000"
  probe.fillStyle = value
  probe.fillRect(0, 0, 1, 1)
  const [red, green, blue, alpha] = probe.getImageData(0, 0, 1, 1).data
  return [red, green, blue, alpha]
}

export function readInks(root: Element): InkPalette {
  const style = getComputedStyle(root)
  const [ink0, ink1, ink2, ink3] = INK_TOKENS.map((token): Rgb => {
    const [red, green, blue] = parseCssColor(style.getPropertyValue(token).trim())
    return [red, green, blue]
  })
  return [ink0, ink1, ink2, ink3]
}

export function observeInkChange(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: THEME_ATTRIBUTES,
  })
  return () => observer.disconnect()
}
