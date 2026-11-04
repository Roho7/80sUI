"use client"

import { cn } from "cn"
import { Avatar as AvatarPrimitive } from "radix-ui"
import * as React from "react"


type AvatarSize = "sm" | "default" | "lg"

type RowSpan = readonly [number, number]

const DISC_CELLS: Record<AvatarSize, number> = { sm: 12, default: 16, lg: 20 }

function readDiscRows(cells: number): RowSpan[] {
  const radius = cells / 2
  return Array.from({ length: cells }, (_, row) => {
    const fromCenter = row + 0.5 - radius
    const half = Math.sqrt(Math.max(radius * radius - fromCenter * fromCenter, 0))
    const left = Math.round(radius - half)
    return [left, cells - left] as const
  })
}

function erodeRows(rows: RowSpan[]): RowSpan[] {
  return rows.map(([left, right], row) => {
    const above = rows[row - 1]
    const below = rows[row + 1]
    if (!above || !below) {
      return [0, 0] as const
    }
    return [
      Math.max(left + 1, above[0], below[0]),
      Math.min(right - 1, above[1], below[1]),
    ] as const
  })
}

function toPolygon(rows: RowSpan[], cells: number): string {
  const percent = (value: number) => `${(value / cells) * 100}%`
  const filled = rows.flatMap(([left, right], row) => (right > left ? [{ row, left, right }] : []))
  const rightSide = filled.flatMap(({ row, right }) => [
    `${percent(right)} ${percent(row)}`,
    `${percent(right)} ${percent(row + 1)}`,
  ])
  const leftSide = [...filled]
    .reverse()
    .flatMap(({ row, left }) => [`${percent(left)} ${percent(row + 1)}`, `${percent(left)} ${percent(row)}`])
  return `polygon(${[...rightSide, ...leftSide].join(", ")})`
}

function readDiscStyle(size: AvatarSize): React.CSSProperties {
  const cells = DISC_CELLS[size]
  const rows = readDiscRows(cells)
  return {
    "--avatar-disc": toPolygon(rows, cells),
    "--avatar-face": toPolygon(erodeRows(rows), cells),
  } as React.CSSProperties
}

const DISC_STYLES: Record<AvatarSize, React.CSSProperties> = {
  sm: readDiscStyle("sm"),
  default: readDiscStyle("default"),
  lg: readDiscStyle("lg"),
}

const discClassName = cn(
  "relative isolate flex shrink-0 select-none",
  "after:absolute after:inset-0 after:-z-10 after:bg-border after:content-[''] after:[clip-path:var(--avatar-disc)]"
)

const faceClassName = "absolute inset-0 size-full [clip-path:var(--avatar-face)]"

function Avatar({
  className,
  size = "default",
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      style={{ ...DISC_STYLES[size], ...style }}
      className={cn(
        "group/avatar size-8 data-[size=lg]:size-10 data-[size=sm]:size-6",
        discClassName,
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(faceClassName, "object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        faceClassName,
        "flex items-center justify-center bg-muted font-pixel text-sm text-foreground uppercase group-data-[size=sm]/avatar:text-sm",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center pixel-border border-background bg-primary text-primary-foreground select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("group/avatar-group flex -space-x-2", className)}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  size = "default",
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & { size?: AvatarSize }) {
  return (
    <div
      data-slot="avatar-group-count"
      data-size={size}
      style={{ ...DISC_STYLES[size], ...style }}
      className={cn(
        "size-8 data-[size=lg]:size-10 data-[size=sm]:size-6",
        discClassName,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          faceClassName,
          "flex items-center justify-center bg-muted font-pixel text-sm text-foreground [&>svg]:size-4"
        )}
      >
        {children}
      </span>
    </div>
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
