export const BRAND_INKS = {
  ink0: "#20231a",
  ink1: "#4b5036",
  ink2: "#888c62",
  ink3: "#c4c79d",
  ink4: "#eeefc8",
  desktop: "#a7ab7f",
} as const

const BRAND_LOGO_ROWS = [
  "T.T.XX.XXXX",
  ".T.X..XX...",
  "T.T.XXXXXX.",
  ".T....X...X",
  "T.T.XX.XXX.",
] as const

function readLogoPath(mark: "X" | "T"): string {
  return BRAND_LOGO_ROWS.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === mark ? [`M${x} ${y}h1v1H${x}z`] : []))
  ).join("")
}

export const BRAND_LOGO = {
  width: BRAND_LOGO_ROWS[0].length,
  height: BRAND_LOGO_ROWS.length,
  digits: readLogoPath("X"),
  trail: readLogoPath("T"),
} as const

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
  const logo = [
    `<path d="${BRAND_LOGO.trail}" transform="translate(5 9) scale(2)" fill="${BRAND_INKS.ink2}"/>`,
    `<path d="${BRAND_LOGO.digits}" transform="translate(5 9) scale(2)" fill="${BRAND_INKS.ink0}"/>`,
  ].join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" shape-rendering="crispEdges">${rects}${logo}</svg>`
}

export function buildKeycapDataUri(size: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildKeycapSvg(size))}`
}
