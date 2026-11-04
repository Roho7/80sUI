"use client"

import { type PointerEvent as ReactPointerEvent, useRef, useState } from "react"

import { SoundEngine } from "@/lib/sound/sound-engine"

const readout = "text-lg"

function engine(): SoundEngine | null {
  return SoundEngine.get()
}

export function PadDemo({ stepPx }: { stepPx: number }) {
  const [x, setX] = useState(0)
  const [events, setEvents] = useState(0)
  const lastStep = useRef(0)

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative h-12 touch-none pixel-border border-border bg-muted dither-25"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          const rect = event.currentTarget.getBoundingClientRect()
          lastStep.current = Math.floor((event.clientX - rect.left) / stepPx)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            return
          }
          const rect = event.currentTarget.getBoundingClientRect()
          const position = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
          const stepIndex = Math.floor(position / stepPx)
          const steps = Math.abs(stepIndex - lastStep.current)
          lastStep.current = stepIndex
          setEvents((count) => count + 1)
          setX(stepIndex * stepPx)
          engine()?.step("pad.tick", steps, position / rect.width)
        }}
      >
        <div className="absolute top-0 h-full w-3 bg-foreground" style={{ left: x }} />
      </div>
      <p className={readout}>pointer events {events}</p>
    </div>
  )
}

const DIAL_LIMIT = 135

export function DialDemo({ detentSize }: { detentSize: number }) {
  const [angleShown, setAngleShown] = useState(0)
  const angle = useRef(0)
  const lastPointer = useRef(0)
  const lastDetent = useRef(0)
  const atLimit = useRef(false)

  const readPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    return (Math.atan2(dx, -dy) * 180) / Math.PI
  }

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative size-32 shrink-0 touch-none pixel-border border-border bg-secondary bevel-raised"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          lastPointer.current = readPointer(event)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            return
          }
          const pointer = readPointer(event)
          let delta = pointer - lastPointer.current
          if (delta > 180) delta -= 360
          if (delta < -180) delta += 360
          lastPointer.current = pointer
          const unclamped = angle.current + delta
          angle.current = Math.min(Math.max(unclamped, -DIAL_LIMIT), DIAL_LIMIT)
          const detent = Math.round(angle.current / detentSize)
          const steps = Math.abs(detent - lastDetent.current)
          if (steps > 0) {
            lastDetent.current = detent
            setAngleShown(Math.max(Math.min(detent * detentSize, DIAL_LIMIT), -DIAL_LIMIT))
            engine()?.step("dial.tick", steps, (angle.current + DIAL_LIMIT) / (DIAL_LIMIT * 2))
          }
          const hitting = unclamped !== angle.current
          if (hitting && !atLimit.current) {
            engine()?.play("dial.end")
          }
          atLimit.current = hitting || Math.abs(angle.current) >= DIAL_LIMIT
        }}
      >
        <div className="absolute inset-0" style={{ transform: `rotate(${angleShown}deg)` }}>
          <div className="absolute top-2 left-1/2 h-10 w-2 -translate-x-1/2 bg-foreground" />
        </div>
      </div>
      <p className={readout}>
        {Math.round(angleShown)} deg of ±{DIAL_LIMIT}
        <br />
        Turn past either end to hit the stop.
      </p>
    </div>
  )
}

const LEVER_TRAVEL = 160

export function LeverDemo({ notches }: { notches: number }) {
  const [fraction, setFraction] = useState(1)
  const lastNotch = useRef(notches)
  const grab = useRef(0)
  const notch = Math.round(fraction * notches)

  const land = (target: number) => engine()?.play(target === 0 ? "lever.on" : "lever.off")

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative w-12 shrink-0 touch-none pixel-border border-border bg-muted dither-50"
        style={{ height: LEVER_TRAVEL + 32 }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          const rect = event.currentTarget.getBoundingClientRect()
          grab.current = event.clientY - rect.top - (notch / notches) * LEVER_TRAVEL
          lastNotch.current = notch
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            return
          }
          const rect = event.currentTarget.getBoundingClientRect()
          const offset = Math.min(Math.max(event.clientY - rect.top - grab.current, 0), LEVER_TRAVEL)
          const next = Math.round((offset / LEVER_TRAVEL) * notches)
          const steps = Math.abs(next - lastNotch.current)
          if (steps === 0) {
            return
          }
          lastNotch.current = next
          setFraction(next / notches)
          if (next === 0 || next === notches) {
            land(next)
          } else {
            engine()?.step("lever.tick", steps, 1 - next / notches)
          }
        }}
        onPointerUp={() => {
          const current = lastNotch.current
          if (current === 0 || current === notches) {
            return
          }
          const target = current < notches / 2 ? 0 : notches
          lastNotch.current = target
          setFraction(target / notches)
          land(target)
        }}
      >
        <div className="absolute left-0 h-8 w-full pixel-border border-border bg-secondary bevel-raised" style={{ top: (notch / notches) * LEVER_TRAVEL }} />
      </div>
      <p className={readout}>
        {notch === 0 ? "ON" : notch === notches ? "OFF" : `notch ${notch} of ${notches}`}
        <br />
        Release mid-travel and it springs to the nearer end.
      </p>
    </div>
  )
}
