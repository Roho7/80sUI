"use client"

import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { CloseGlyph } from "@/components/ui/pixel-glyphs"
import { type Point, useWindowDrag } from "@/hooks/use-window-drag"

type WindowProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: string
  defaultPosition?: Point
  isActive?: boolean
  statusBar?: React.ReactNode
  onClose?: () => void
  onActivate?: () => void
}

const ORIGIN: Point = { x: 0, y: 0 }

function stopPointerPropagation(event: React.PointerEvent) {
  event.stopPropagation()
}

function Window({
  title,
  defaultPosition,
  isActive = true,
  statusBar,
  onClose,
  onActivate,
  className,
  style,
  children,
  ...props
}: WindowProps) {
  const isDraggable = defaultPosition !== undefined
  const { position, isDragging, startDrag } = useWindowDrag(defaultPosition ?? ORIGIN)

  return (
    <section
      aria-label={title}
      data-slot="window"
      data-active={isActive}
      data-dragging={isDragging}
      className={cn(
        "flex flex-col pixel-border border-border bg-card text-card-foreground offset-shadow-3",
        isDraggable ? "absolute" : "relative",
        className
      )}
      style={isDraggable ? { left: position.x, top: position.y, ...style } : style}
      onPointerDownCapture={onActivate}
      {...props}
    >
      <header
        data-slot="window-titlebar"
        onPointerDown={isDraggable ? startDrag : undefined}
        className={cn(
          "flex h-8 shrink-0 items-center gap-3 border-b-(length:--pixel) border-border pr-1 pl-3 font-pixel text-[16px] leading-none uppercase select-none",
          isActive
            ? "bg-titlebar text-titlebar-foreground"
            : "bg-card text-card-foreground",
          isDraggable && "cursor-grab touch-none",
          isDragging && "cursor-grabbing"
        )}
      >
        <h2 className="truncate">{title}</h2>
        <span aria-hidden="true" className="h-4 min-w-6 flex-1 stripes" />
        {onClose && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Close ${title}`}
            className="text-current"
            onPointerDown={stopPointerPropagation}
            onClick={onClose}
          >
            <CloseGlyph />
          </Button>
        )}
      </header>
      <div data-slot="window-body" className="min-h-0 flex-1">
        {children}
      </div>
      {statusBar && (
        <footer
          data-slot="window-statusbar"
          className="flex h-7 shrink-0 items-center gap-2 border-t-(length:--pixel) border-border px-2 text-lg leading-none"
        >
          {statusBar}
        </footer>
      )}
    </section>
  )
}

export { Window, type WindowProps }
