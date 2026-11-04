"use client"

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { readPixel } from "./readTokens"

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

export function useSteppedDrag(initialPosition: Point): SteppedDrag {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const positionRef = useRef(initialPosition)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])

  const startDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    stopRef.current?.()
    const pixel = readPixel(document.documentElement)
    const grab = {
      x: event.clientX - positionRef.current.x,
      y: event.clientY - positionRef.current.y,
    }

    function trackPointer(moveEvent: PointerEvent) {
      const next = {
        x: snapToPixel(moveEvent.clientX - grab.x, pixel),
        y: snapToPixel(moveEvent.clientY - grab.y, pixel),
      }
      positionRef.current = next
      setPosition(next)
    }

    function stop() {
      window.removeEventListener("pointermove", trackPointer)
      window.removeEventListener("pointerup", drop)
      window.removeEventListener("pointercancel", drop)
      stopRef.current = null
    }

    function drop() {
      stop()
      setIsDragging(false)
    }

    window.addEventListener("pointermove", trackPointer)
    window.addEventListener("pointerup", drop)
    window.addEventListener("pointercancel", drop)
    stopRef.current = stop
    setIsDragging(true)
  }, [])

  return { position, isDragging, startDrag }
}
