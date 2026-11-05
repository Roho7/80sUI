import { cn } from "cn"
import type * as React from "react"

type GlyphProps = React.ComponentProps<"svg">

type GlyphDirection = "down" | "left" | "up" | "right"

type DirectionalGlyphProps = GlyphProps & {
  direction?: GlyphDirection
}

const GLYPH_PATHS = {
  check:
    "M6 1h1v1H6zM5 2h2v1H5zM0 3h1v1H0zM4 3h2v1H4zM0 4h2v1H0zM3 4h2v1H3zM1 5h3v1H1zM2 6h1v1H2z",
  minus: "M1 3h5v1H1z",
  close:
    "M0 0h2v1H0zM5 0h2v1H5zM1 1h2v1H1zM4 1h2v1H4zM2 2h3v1H2zM3 3h1v1H3zM2 4h3v1H2zM1 5h2v1H1zM4 5h2v1H4zM0 6h2v1H0zM5 6h2v1H5z",
  chevron:
    "M0 2h2v1H0zM5 2h2v1H5zM1 3h2v1H1zM4 3h2v1H4zM2 4h3v1H2zM3 5h1v1H3z",
  arrow: "M0 2h7v1H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z",
  dot: "M2 1h3v1H2zM1 2h5v3H1zM2 5h3v1H2z",
  search: "M1 0h3v1H1zM0 1h1v3H0zM4 1h1v3H4zM1 4h3v1H1zM4 4h1v1H4zM5 5h1v1H5zM6 6h1v1H6z",
  panel: "M0 0h7v1H0zM0 1h1v5H0zM2 1h1v5H2zM6 1h1v5H6zM0 6h7v1H0z",
  sun: "M3 0h1v1H3zM1 1h1v1H1zM5 1h1v1H5zM2 2h3v3H2zM0 3h1v1H0zM6 3h1v1H6zM1 5h1v1H1zM5 5h1v1H5zM3 6h1v1H3z",
  moon: "M2 0h3v1H2zM1 1h2v1H1zM0 2h2v3H0zM1 5h2v1H1zM2 6h3v1H2z",
  speaker:
    "M2 0h1v1H2zM1 1h2v1H1zM0 2h3v3H0zM1 5h2v1H1zM2 6h1v1H2zM4 1h1v1H4zM5 2h1v3H5zM4 5h1v1H4z",
  speakerMuted:
    "M2 0h1v1H2zM1 1h2v1H1zM0 2h3v3H0zM1 5h2v1H1zM2 6h1v1H2zM4 2h1v1H4zM6 2h1v1H6zM5 3h1v1H5zM4 4h1v1H4zM6 4h1v1H6z",
} as const

const RADIO_PATHS = {
  ring: "M3 0h4v1H3zM1 1h2v1H1zM7 1h2v1H7zM1 2h1v1H1zM8 2h1v1H8zM0 3h1v4H0zM9 3h1v4H9zM1 7h1v1H1zM8 7h1v1H8zM1 8h2v1H1zM7 8h2v1H7zM3 9h4v1H3z",
  well: "M3 1h4v1H3zM2 2h6v1H2zM1 3h8v4H1zM2 7h6v1H2zM3 8h4v1H3z",
  dot: "M4 3h2v1H4zM3 4h4v2H3zM4 6h2v1H4z",
} as const

const ICON_PATHS = {
  folderInk: "M1 2h6v2H1zM0 4h16v11H0z",
  folderPaper: "M2 3h4v1H2zM1 5h14v9H1z",
  folderFlap: "M1 7h14v1H1z",
  documentPaper: "M3 1h7v3H3zM3 4h10v11H3z",
  documentInk:
    "M2 0h9v1H2zM2 1h1v15H2zM13 3h1v13h-1zM3 15h10v1H3zM10 1h1v3h-1zM11 3h2v1h-2zM11 1h1v1h-1zM12 2h1v1h-1zM5 6h6v1H5zM5 8h6v1H5zM5 10h6v1H5zM5 12h4v1H5z",
  terminalInk: "M0 1h16v11H0zM5 12h6v2H5zM3 14h10v1H3z",
  terminalPaper: "M2 3h1v1H2zM3 4h1v1H3zM2 5h1v1H2zM5 5h3v1H5z",
} as const

const DIRECTION_ROTATIONS: Record<GlyphDirection, number> = {
  down: 0,
  left: 90,
  up: 180,
  right: 270,
}

function renderGlyph(path: string, { className, ...props }: GlyphProps, rotation = 0) {
  return (
    <svg
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-3.5 fill-current", className)}
      {...props}
    >
      <path d={path} transform={rotation === 0 ? undefined : `rotate(${rotation} 3.5 3.5)`} />
    </svg>
  )
}

function CheckGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.check, props)
}

function MinusGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.minus, props)
}

function CloseGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.close, props)
}

function ChevronGlyph({ direction = "down", ...props }: DirectionalGlyphProps) {
  return renderGlyph(GLYPH_PATHS.chevron, props, DIRECTION_ROTATIONS[direction])
}

function ArrowGlyph({ direction = "down", ...props }: DirectionalGlyphProps) {
  return renderGlyph(GLYPH_PATHS.arrow, props, DIRECTION_ROTATIONS[direction])
}

function DotGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.dot, props)
}

function SearchGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.search, props)
}

function PanelGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.panel, props)
}

function SunGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.sun, props)
}

function MoonGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.moon, props)
}

function SpeakerGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.speaker, props)
}

function SpeakerMutedGlyph(props: GlyphProps) {
  return renderGlyph(GLYPH_PATHS.speakerMuted, props)
}

function RadioRingGlyph({ className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 10 10"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
      {...props}
    >
      <path className="fill-card" d={RADIO_PATHS.well} />
      <path className="fill-current" d={RADIO_PATHS.ring} />
    </svg>
  )
}

function RadioDotGlyph({ className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 10 10"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-5 shrink-0 fill-current", className)}
      {...props}
    >
      <path d={RADIO_PATHS.dot} />
    </svg>
  )
}

function renderIcon(paths: readonly { className: string; d: string }[], { className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      {paths.map(({ className: pathClassName, d }) => (
        <path key={d} className={pathClassName} d={d} />
      ))}
    </svg>
  )
}

function FolderGlyph(props: GlyphProps) {
  return renderIcon(
    [
      { className: "fill-foreground", d: ICON_PATHS.folderInk },
      { className: "fill-card", d: ICON_PATHS.folderPaper },
      { className: "fill-foreground", d: ICON_PATHS.folderFlap },
    ],
    props
  )
}

function DocumentGlyph(props: GlyphProps) {
  return renderIcon(
    [
      { className: "fill-card", d: ICON_PATHS.documentPaper },
      { className: "fill-foreground", d: ICON_PATHS.documentInk },
    ],
    props
  )
}

function TerminalGlyph(props: GlyphProps) {
  return renderIcon(
    [
      { className: "fill-foreground", d: ICON_PATHS.terminalInk },
      { className: "fill-card", d: ICON_PATHS.terminalPaper },
    ],
    props
  )
}

function ErrorGlyph({ className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 13 13"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-10 shrink-0", className)}
      {...props}
    >
      <path
        className="fill-foreground"
        d="M4 0h5v1h2v2h1v2h1v3h-1v2h-1v2H9v1H4v-1H2v-2H1V8H0V5h1V3h1V1h2z"
      />
      <path
        className="fill-card"
        transform="translate(3 3)"
        d={GLYPH_PATHS.close}
      />
    </svg>
  )
}

export {
  ArrowGlyph,
  CheckGlyph,
  ChevronGlyph,
  CloseGlyph,
  DocumentGlyph,
  DotGlyph,
  ErrorGlyph,
  FolderGlyph,
  type GlyphDirection,
  MinusGlyph,
  MoonGlyph,
  PanelGlyph,
  RadioDotGlyph,
  RadioRingGlyph,
  SearchGlyph,
  SpeakerGlyph,
  SpeakerMutedGlyph,
  SunGlyph,
  TerminalGlyph,
}
