import { cn } from "cn"
import type * as React from "react"

type GlyphProps = React.ComponentProps<"svg">

const GLYPH_PATHS = {
  check:
    "M6 1h1v1H6zM5 2h2v1H5zM0 3h1v1H0zM4 3h2v1H4zM0 4h2v1H0zM3 4h2v1H3zM1 5h3v1H1zM2 6h1v1H2z",
  minus: "M1 3h5v1H1z",
  close:
    "M0 0h2v1H0zM5 0h2v1H5zM1 1h2v1H1zM4 1h2v1H4zM2 2h3v1H2zM3 3h1v1H3zM2 4h3v1H2zM1 5h2v1H1zM4 5h2v1H4zM0 6h2v1H0zM5 6h2v1H5z",
} as const

function renderGlyph(path: string, { className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("size-3.5 fill-current", className)}
      {...props}
    >
      <path d={path} />
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

export { CheckGlyph, CloseGlyph, ErrorGlyph, MinusGlyph }
