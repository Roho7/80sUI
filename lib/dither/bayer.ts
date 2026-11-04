export type BayerMatrixSize = 4 | 8

function readBayer2(x: number, y: number): number {
  const value = (Math.floor(x) * 0.5 + Math.floor(y) * Math.floor(y) * 0.75) % 1
  return value < 0 ? value + 1 : value
}

function readBayer4(x: number, y: number): number {
  return readBayer2(x * 0.5, y * 0.5) * 0.25 + readBayer2(x, y)
}

function readBayer8(x: number, y: number): number {
  return readBayer4(x * 0.5, y * 0.5) * 0.25 + readBayer2(x, y)
}

const BAYER_READERS: Record<BayerMatrixSize, (x: number, y: number) => number> = {
  4: readBayer4,
  8: readBayer8,
}

export function readBayerThreshold(
  x: number,
  y: number,
  size: BayerMatrixSize
): number {
  return BAYER_READERS[size](x, y)
}
