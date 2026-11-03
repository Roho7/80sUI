import { writeFileSync } from "node:fs"
import { deflateSync } from "node:zlib"

const WIDTH = 480
const HEIGHT = 300
const CENTER_X = WIDTH / 2
const CENTER_Y = HEIGHT / 2 + 6
const HALF_WIDTH = 200
const IRIS_RADIUS = 86
const PUPIL_RADIUS = 34

function hash(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function smoothNoise(x, y) {
  const left = Math.floor(x)
  const top = Math.floor(y)
  const fx = x - left
  const fy = y - top
  const a = hash(left, top)
  const b = hash(left + 1, top)
  const c = hash(left, top + 1)
  const d = hash(left + 1, top + 1)
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function fractalNoise(x, y) {
  return (
    smoothNoise(x / 40, y / 40) * 0.5 +
    smoothNoise(x / 14, y / 14) * 0.3 +
    smoothNoise(x / 4, y / 4) * 0.2
  )
}

function readLidHeight(x, isUpper) {
  const t = (x - CENTER_X) / HALF_WIDTH
  if (Math.abs(t) >= 1) {
    return 0
  }
  const skew = isUpper ? 1 - 0.18 * t : 1 + 0.1 * t
  return (isUpper ? 98 : 64) * Math.pow(1 - t * t, 0.75) * skew
}

function shadeSkin(x, y) {
  const upper = readLidHeight(x, true)
  const creaseY = CENTER_Y - upper * 1.45 - 12
  const creaseDistance = Math.abs(y - creaseY)
  const crease = creaseDistance < 10 && upper > 0 ? (1 - creaseDistance / 10) * 0.28 : 0
  const vignette = Math.hypot((x - CENTER_X) / WIDTH, (y - CENTER_Y) / HEIGHT) * 0.5
  return 0.68 + (fractalNoise(x, y) - 0.5) * 0.22 - crease - vignette
}

function shadeEye(x, y) {
  const upper = readLidHeight(x, true)
  const lower = readLidHeight(x, false)
  const topEdge = CENTER_Y - upper
  const bottomEdge = CENTER_Y + lower
  if (y < topEdge - 7 || y > bottomEdge + 4 || upper === 0) {
    const slant = (topEdge - y) * ((x - CENTER_X) / HALF_WIDTH) * 0.9
    const lash = upper > 8 && y < topEdge && y > topEdge - 26 && hash(Math.floor((x + slant) / 3), 7) > 0.55
      ? Math.max(0, 1 - (topEdge - y) / 26) * 0.6
      : 0
    return shadeSkin(x, y) - lash
  }
  if (y < topEdge + 3) {
    return 0.06
  }
  if (y > bottomEdge - 2) {
    return 0.3
  }
  const irisX = CENTER_X + 6
  const irisY = CENTER_Y - 10
  const distance = Math.hypot(x - irisX, y - irisY)
  const lidShadow = Math.max(0, 1 - (y - topEdge) / 30) * 0.35
  if (distance < PUPIL_RADIUS) {
    return 0.03
  }
  const highlight = Math.hypot(x - (irisX + 22), y - (irisY - 24))
  if (highlight < 11) {
    return 0.97
  }
  if (distance < IRIS_RADIUS) {
    const angle = Math.atan2(y - irisY, x - irisX)
    const fibres = (smoothNoise(angle * 60, distance / 10) - 0.5) * 0.3
    const radial = (distance - PUPIL_RADIUS) / (IRIS_RADIUS - PUPIL_RADIUS)
    const limbus = radial > 0.86 ? 0.22 : 0
    return 0.24 + radial * 0.22 + fibres - limbus - lidShadow
  }
  const t = (x - CENTER_X) / HALF_WIDTH
  return 0.9 - t * t * 0.38 - lidShadow - smoothNoise(x / 9, y / 9) * 0.06
}

function encodeChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, "ascii"), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(computeCrc(body))
  return Buffer.concat([length, body, crc])
}

function computeCrc(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

const rows = Buffer.alloc((WIDTH + 1) * HEIGHT)
for (let y = 0; y < HEIGHT; y += 1) {
  rows[y * (WIDTH + 1)] = 0
  for (let x = 0; x < WIDTH; x += 1) {
    const value = Math.min(1, Math.max(0, shadeEye(x, y)))
    rows[y * (WIDTH + 1) + 1 + x] = Math.round(value * 255)
  }
}

const header = Buffer.alloc(13)
header.writeUInt32BE(WIDTH, 0)
header.writeUInt32BE(HEIGHT, 4)
header[8] = 8
header[9] = 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  encodeChunk("IHDR", header),
  encodeChunk("IDAT", deflateSync(rows)),
  encodeChunk("IEND", Buffer.alloc(0)),
])

writeFileSync(new URL("../public/eye.png", import.meta.url), png)
