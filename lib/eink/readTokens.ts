const DEFAULT_PIXEL = 2

export function readPixel(root: Element): number {
  const parsed = Number.parseFloat(getComputedStyle(root).getPropertyValue("--pixel"))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PIXEL
}
