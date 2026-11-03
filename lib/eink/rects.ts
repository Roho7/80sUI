import { REFRESH_EFFECTS } from "./refreshSequences"
import type { Rect, RefreshRequest } from "./types"

export function readElementRect(element: Element): Rect {
  const bounds = element.getBoundingClientRect()
  return {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
  }
}

export function readViewportRect(): Rect {
  return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
}

export function doRectsOverlap(first: Rect, second: Rect): boolean {
  return (
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height
  )
}

export function uniteRects(first: Rect, second: Rect): Rect {
  const left = Math.min(first.x, second.x)
  const top = Math.min(first.y, second.y)
  const right = Math.max(first.x + first.width, second.x + second.width)
  const bottom = Math.max(first.y + first.height, second.y + second.height)
  return { x: left, y: top, width: right - left, height: bottom - top }
}

export function translateRect(rect: Rect, dx: number, dy: number): Rect {
  return { ...rect, x: rect.x + dx, y: rect.y + dy }
}

function mergeTwoRequests(
  first: RefreshRequest,
  second: RefreshRequest
): RefreshRequest {
  const isFirstStronger =
    REFRESH_EFFECTS[first.kind].rank >= REFRESH_EFFECTS[second.kind].rank
  return {
    rect: uniteRects(first.rect, second.rect),
    kind: isFirstStronger ? first.kind : second.kind,
  }
}

export function mergeOverlappingRequests(
  requests: readonly RefreshRequest[]
): RefreshRequest[] {
  const merged: RefreshRequest[] = []
  for (const request of requests) {
    let current = request
    let overlapIndex = merged.findIndex((existing) =>
      doRectsOverlap(existing.rect, current.rect)
    )
    while (overlapIndex !== -1) {
      current = mergeTwoRequests(merged[overlapIndex], current)
      merged.splice(overlapIndex, 1)
      overlapIndex = merged.findIndex((existing) =>
        doRectsOverlap(existing.rect, current.rect)
      )
    }
    merged.push(current)
  }
  return merged
}
