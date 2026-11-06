"use client"

import { cn } from "cn"
import type * as React from "react"
import { useId } from "react"

const STAR_SPRITE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 7' shape-rendering='crispEdges'%3E%3Crect x='10' y='3' width='1' height='1'/%3E%3Crect x='17' y='1' width='1' height='1'/%3E%3Crect x='17' y='2' width='1' height='1'/%3E%3Crect x='15' y='3' width='1' height='1'/%3E%3Crect x='16' y='3' width='1' height='1'/%3E%3Crect x='17' y='3' width='1' height='1'/%3E%3Crect x='18' y='3' width='1' height='1'/%3E%3Crect x='19' y='3' width='1' height='1'/%3E%3Crect x='17' y='4' width='1' height='1'/%3E%3Crect x='17' y='5' width='1' height='1'/%3E%3Crect x='24' y='1' width='1' height='1'/%3E%3Crect x='23' y='2' width='1' height='1'/%3E%3Crect x='24' y='2' width='1' height='1'/%3E%3Crect x='25' y='2' width='1' height='1'/%3E%3Crect x='22' y='3' width='1' height='1'/%3E%3Crect x='23' y='3' width='1' height='1'/%3E%3Crect x='24' y='3' width='1' height='1'/%3E%3Crect x='25' y='3' width='1' height='1'/%3E%3Crect x='26' y='3' width='1' height='1'/%3E%3Crect x='23' y='4' width='1' height='1'/%3E%3Crect x='24' y='4' width='1' height='1'/%3E%3Crect x='25' y='4' width='1' height='1'/%3E%3Crect x='24' y='5' width='1' height='1'/%3E%3Crect x='31' y='0' width='1' height='1'/%3E%3Crect x='31' y='1' width='1' height='1'/%3E%3Crect x='30' y='2' width='1' height='1'/%3E%3Crect x='31' y='2' width='1' height='1'/%3E%3Crect x='32' y='2' width='1' height='1'/%3E%3Crect x='28' y='3' width='1' height='1'/%3E%3Crect x='29' y='3' width='1' height='1'/%3E%3Crect x='30' y='3' width='1' height='1'/%3E%3Crect x='31' y='3' width='1' height='1'/%3E%3Crect x='32' y='3' width='1' height='1'/%3E%3Crect x='33' y='3' width='1' height='1'/%3E%3Crect x='34' y='3' width='1' height='1'/%3E%3Crect x='30' y='4' width='1' height='1'/%3E%3Crect x='31' y='4' width='1' height='1'/%3E%3Crect x='32' y='4' width='1' height='1'/%3E%3Crect x='31' y='5' width='1' height='1'/%3E%3Crect x='31' y='6' width='1' height='1'/%3E%3C/svg%3E\")"

const PIXEL = "var(--pixel, 2px)"
const STAR_CELLS = 7
const FRAME_SEQUENCE = [
  { at: "0%, 70%", frame: 0 },
  { at: "73%", frame: 1 },
  { at: "76%", frame: 2 },
  { at: "79%", frame: 3 },
  { at: "82%", frame: 4 },
  { at: "86%", frame: 3 },
  { at: "89%", frame: 2 },
  { at: "92%", frame: 1 },
  { at: "95%, 100%", frame: 0 },
] as const
const FRAME_COUNT = 5
const STILL_FRAME = 2

const MAX_NUDGE = 3
const PERIOD_JITTER = 0.6

type Corner = "top-left" | "top-right" | "bottom-right" | "bottom-left"

type StarAnchor = {
  position: string
  towardX: -1 | 1
  towardY: -1 | 1
  period: number
}

const STARS: Record<Corner, StarAnchor> = {
  "top-left": { position: "top-0 left-0", towardX: -1, towardY: -1, period: 3.7 },
  "top-right": { position: "top-0 right-0", towardX: 1, towardY: -1, period: 4.3 },
  "bottom-right": { position: "right-0 bottom-0", towardX: 1, towardY: 1, period: 3.1 },
  "bottom-left": { position: "bottom-0 left-0", towardX: -1, towardY: 1, period: 4.9 },
}

function createRandom(seed: string): () => number {
  let state = [...seed].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261)
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function readNudge(random: () => number): number {
  return Math.floor(random() * (MAX_NUDGE * 2 + 1)) - MAX_NUDGE
}

function readStarStyle(anchor: StarAnchor, random: () => number): StarStyle {
  const nudgeX = readNudge(random)
  const period = anchor.period + (random() * 2 - 1) * PERIOD_JITTER
  return {
    translate: `calc(${anchor.towardX * 50}% + ${PIXEL} * ${nudgeX}) ${anchor.towardY * 50}%`,
    "--twinkle-period": `${period.toFixed(2)}s`,
    "--twinkle-delay": `${(-random() * period).toFixed(2)}s`,
  }
}

function readFrameOffset(frame: number): string {
  return `calc(${PIXEL} * ${-frame * STAR_CELLS}) 0`
}

const STYLES = `
@keyframes ui95-twinkle {
${FRAME_SEQUENCE.map(({ at, frame }) => `  ${at} { mask-position: ${readFrameOffset(frame)}; }`).join("\n")}
}
[data-slot="highlighted-text-star"] {
  width: calc(${PIXEL} * ${STAR_CELLS});
  height: calc(${PIXEL} * ${STAR_CELLS});
  background-color: currentColor;
  mask-image: ${STAR_SPRITE};
  mask-size: calc(${PIXEL} * ${STAR_CELLS * FRAME_COUNT}) calc(${PIXEL} * ${STAR_CELLS});
  mask-repeat: no-repeat;
  mask-position: 0 0;
  animation: ui95-twinkle var(--twinkle-period) steps(1, end) var(--twinkle-delay) infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="highlighted-text-star"] {
    animation: none;
    mask-position: ${readFrameOffset(STILL_FRAME)};
  }
}
`

type StarStyle = React.CSSProperties & {
  "--twinkle-period": string
  "--twinkle-delay": string
}

function HighlightedText({ className, children, ...props }: React.ComponentProps<"span">) {
  const random = createRandom(useId())
  return (
    <span data-slot="highlighted-text" className={cn("relative inline-block", className)} {...props}>
      <style href="ui95-highlighted-text" precedence="default">
        {STYLES}
      </style>
      {children}
      {Object.entries(STARS).map(([corner, anchor]) => (
        <span
          key={corner}
          aria-hidden="true"
          data-slot="highlighted-text-star"
          className={cn("pointer-events-none absolute", anchor.position)}
          style={readStarStyle(anchor, random)}
        />
      ))}
    </span>
  )
}

export { HighlightedText }
