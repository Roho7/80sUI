const MAP_MAX_SIZE = 256

const MAP_DIVISOR = 4

export const BARREL_REACH = 0.4

export type BarrelMap = { href: string; scale: number }

function readDisplacement(unit: number, radiusSquared: number, reach: number): number {
  return (unit * reach * (radiusSquared - 1)) / (1 + reach)
}

export function createBarrelMap(width: number, height: number, curvature: number): BarrelMap | null {
  const mapWidth = Math.max(2, Math.min(MAP_MAX_SIZE, Math.ceil(width / MAP_DIVISOR)))
  const mapHeight = Math.max(2, Math.min(MAP_MAX_SIZE, Math.ceil(height / MAP_DIVISOR)))
  const canvas = document.createElement("canvas")
  canvas.width = mapWidth
  canvas.height = mapHeight
  const context = canvas.getContext("2d")
  if (!context) {
    return null
  }
  const reach = curvature * BARREL_REACH
  const shifts = new Float32Array(mapWidth * mapHeight * 2)
  let peak = 0
  for (let row = 0; row < mapHeight; row++) {
    for (let column = 0; column < mapWidth; column++) {
      const unitX = ((column + 0.5) / mapWidth) * 2 - 1
      const unitY = ((row + 0.5) / mapHeight) * 2 - 1
      const radiusSquared = (unitX * unitX + unitY * unitY) / 2
      const shiftX = readDisplacement(unitX, radiusSquared, reach) * (width / 2)
      const shiftY = readDisplacement(unitY, radiusSquared, reach) * (height / 2)
      const index = (row * mapWidth + column) * 2
      shifts[index] = shiftX
      shifts[index + 1] = shiftY
      peak = Math.max(peak, Math.abs(shiftX), Math.abs(shiftY))
    }
  }
  const scale = Math.max(peak * 2, 1)
  const image = context.createImageData(mapWidth, mapHeight)
  for (let index = 0; index < mapWidth * mapHeight; index++) {
    image.data[index * 4] = Math.round((0.5 + shifts[index * 2] / scale) * 255)
    image.data[index * 4 + 1] = Math.round((0.5 + shifts[index * 2 + 1] / scale) * 255)
    image.data[index * 4 + 2] = 128
    image.data[index * 4 + 3] = 255
  }
  context.putImageData(image, 0, 0)
  return { href: canvas.toDataURL("image/png"), scale }
}
