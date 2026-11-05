import { readFileSync, writeFileSync } from "node:fs"

import { readBayerThreshold } from "../lib/dither/bayer.ts"

const SIZE = 7
const CENTER = (SIZE - 1) / 2
const PHASES = [0, 0.3, 0.55, 0.8, 1]
const COMPONENT_PATH = new URL("../components/ui/highlighted-text.tsx", import.meta.url)
const SPRITE_LINE = /^const STAR_SPRITE =.*$/m

function readStarIntensity(x, y, phase) {
  const dx = Math.abs(x - CENTER)
  const dy = Math.abs(y - CENTER)
  if (phase === 0) {
    return 0
  }
  if (dx === 0 && dy === 0) {
    return 1
  }
  const rayLength = phase * (CENTER + 0.6)
  if (Math.min(dx, dy) === 0) {
    return Math.min(1, Math.max(0, rayLength - Math.max(dx, dy) + 0.5))
  }
  if (dx === 1 && dy === 1) {
    return Math.max(0, phase - 0.45)
  }
  return 0
}

function bakeFrame(phase) {
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from(
      { length: SIZE },
      (_, x) => {
        const near = Math.min(Math.abs(x - CENTER), Math.abs(y - CENTER))
        const far = Math.max(Math.abs(x - CENTER), Math.abs(y - CENTER))
        return readStarIntensity(x, y, phase) > readBayerThreshold(near, far, 4)
      }
    )
  )
}

function encodeSprite(frames) {
  const rects = frames.flatMap((frame, index) =>
    frame.flatMap((row, y) =>
      row.flatMap((isOn, x) => (isOn ? [`<rect x='${index * SIZE + x}' y='${y}' width='1' height='1'/>`] : []))
    )
  )
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${frames.length * SIZE} ${SIZE}' shape-rendering='crispEdges'>${rects.join("")}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, " ").replace(/%3D/g, "=").replace(/%3A/g, ":").replace(/%2F/g, "/").replace(/%27/g, "'")}")`
}

function printFrames(frames) {
  for (let y = 0; y < SIZE; y += 1) {
    console.log(frames.map((frame) => frame[y].map((isOn) => (isOn ? "#" : ".")).join("")).join("   "))
  }
}

const frames = PHASES.map(bakeFrame)
printFrames(frames)

if (process.argv.includes("--write")) {
  const source = readFileSync(COMPONENT_PATH, "utf8")
  if (!SPRITE_LINE.test(source)) {
    console.error("bake-twinkle-star: components/ui/highlighted-text.tsx has no `const STAR_SPRITE =` line to replace")
    process.exit(1)
  }
  writeFileSync(COMPONENT_PATH, source.replace(SPRITE_LINE, `const STAR_SPRITE = ${JSON.stringify(encodeSprite(frames))}`))
  console.log(`bake-twinkle-star: wrote ${frames.length} frames of ${SIZE}x${SIZE}`)
}
