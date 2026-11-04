"use client"

import { cn } from "cn"
import * as React from "react"

const FRAME_MS = 100
const TAIL_LENGTH = 5

const RING: readonly (readonly [number, number])[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [3, 4],
  [2, 4],
  [1, 4],
  [0, 4],
  [0, 3],
  [0, 2],
  [0, 1],
]

function usePixelFrame() {
  const [frame, setFrame] = React.useState(0)

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(
      () => setFrame((current) => (current + 1) % RING.length),
      FRAME_MS
    )
    return () => window.clearInterval(id)
  }, [])

  return frame
}

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const frame = usePixelFrame()

  return (
    <svg
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      fill="currentColor"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4", className)}
      {...props}
    >
      {Array.from({ length: TAIL_LENGTH }, (_, offset) => {
        const [x, y] = RING[(frame + RING.length - offset) % RING.length]
        return <rect key={offset} x={x} y={y} width="1" height="1" />
      })}
    </svg>
  )
}

export { Spinner }
