"use client"

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { readFps, readPixel } from "./readTokens"
import { readElementRect, translateRect, uniteRects } from "./rects"
import { useEink } from "./useEink"

export type Point = {
  x: number
  y: number
}

export type SteppedDrag = {
  position: Point
  isDragging: boolean
  startDrag: (event: ReactPointerEvent<HTMLElement>) => void
}

function snapToPixel(value: number, pixel: number): number {
  return Math.round(value / pixel) * pixel
}

export function useSteppedDrag(
  ref: RefObject<HTMLElement | null>,
  initialPosition: Point
): SteppedDrag {
  const { engine } = useEink()
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const positionRef = useRef(initialPosition)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])

  const startDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const element = ref.current
      if (event.button !== 0 || element === null) {
        return
      }
      const node: HTMLElement = element
      event.preventDefault()
      stopRef.current?.()
      const root = document.documentElement
      const pixel = readPixel(root)
      const fps = engine?.readFps() ?? readFps(root)
      const grab = {
        x: event.clientX - positionRef.current.x,
        y: event.clientY - positionRef.current.y,
      }
      let target = positionRef.current
      let trail = readElementRect(node)

      function applyStep() {
        const current = positionRef.current
        if (target.x === current.x && target.y === current.y) {
          return
        }
        engine?.captureGhost(node)
        const moved = translateRect(
          readElementRect(node),
          target.x - current.x,
          target.y - current.y
        )
        trail = uniteRects(trail, moved)
        positionRef.current = target
        setPosition(target)
      }

      function trackPointer(moveEvent: PointerEvent) {
        target = {
          x: snapToPixel(moveEvent.clientX - grab.x, pixel),
          y: snapToPixel(moveEvent.clientY - grab.y, pixel),
        }
      }

      const interval = window.setInterval(() => applyStep(), 1000 / fps)

      function stop() {
        window.clearInterval(interval)
        window.removeEventListener("pointermove", trackPointer)
        window.removeEventListener("pointerup", drop)
        window.removeEventListener("pointercancel", drop)
        stopRef.current = null
      }

      function drop() {
        applyStep()
        stop()
        setIsDragging(false)
        engine?.requestRefreshRect(trail, "region")
      }

      window.addEventListener("pointermove", trackPointer)
      window.addEventListener("pointerup", drop)
      window.addEventListener("pointercancel", drop)
      stopRef.current = stop
      setIsDragging(true)
    },
    [engine, ref]
  )

  return { position, isDragging, startDrag }
}
