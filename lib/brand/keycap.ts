export const BRAND_INKS = {
  ink0: "#20231a",
  ink1: "#4b5036",
  ink2: "#888c62",
  ink3: "#c4c79d",
  ink4: "#eeefc8",
  desktop: "#a7ab7f",
} as const

export const START_LOGO_PATH =
  "M6 0h1v5H6zM10 0h1v5h-1zM7 1h1v1H7zM8 2h1v1H8zM9 3h1v1H9zM4 0h1v2H4zM4 3h1v2H4zM2 1h1v1H2zM2 3h1v1H2zM0 2h1v1H0z"

type Cell = readonly [x: number, y: number, width: number, height: number, fill: string]

const KEYCAP_CELLS: readonly Cell[] = [
  [2, 1, 28, 30, BRAND_INKS.ink1],
  [1, 2, 30, 28, BRAND_INKS.ink1],
  [3, 2, 26, 28, BRAND_INKS.ink3],
  [2, 3, 28, 26, BRAND_INKS.ink3],
  [3, 24, 26, 6, BRAND_INKS.ink2],
  [2, 24, 28, 5, BRAND_INKS.ink2],
  [27, 3, 3, 21, BRAND_INKS.ink2],
  [5, 3, 22, 21, BRAND_INKS.ink4],
  [4, 4, 24, 19, BRAND_INKS.ink4],
]

export function buildKeycapSvg(size: number): string {
  const rects = KEYCAP_CELLS.map(
    ([x, y, width, height, fill]) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`
  ).join("")
  const logo = `<path d="${START_LOGO_PATH}" transform="translate(5 9) scale(2)" fill="${BRAND_INKS.ink1}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" shape-rendering="crispEdges">${rects}${logo}</svg>`
}

export function buildKeycapDataUri(size: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildKeycapSvg(size))}`
}
