"use client"

import { cn } from "cn"
import * as React from "react"

type DesktopIconProps = Omit<React.ComponentProps<"button">, "onSelect"> & {
  icon: React.ReactNode
  label: string
  isSelected?: boolean
  onSelect?: () => void
  onOpen?: () => void
}

function DesktopIcon({
  icon,
  label,
  isSelected = false,
  onSelect,
  onOpen,
  className,
  onClick,
  onDoubleClick,
  onKeyDown,
  ...props
}: DesktopIconProps) {
  return (
    <button
      type="button"
      data-slot="desktop-icon"
      data-selected={isSelected}
      aria-pressed={isSelected}
      className={cn(
        "group/desktop-icon flex w-20 flex-col items-center gap-1 p-1 text-center text-foreground select-none disabled:pointer-events-none disabled:text-muted-foreground",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        onSelect?.()
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        onOpen?.()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === "Enter") {
          event.preventDefault()
          onOpen?.()
        }
      }}
      {...props}
    >
      <span className="relative grid size-8 place-items-center">
        {icon}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-foreground dither-50 group-data-[selected=true]/desktop-icon:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-background dither-50 group-disabled/desktop-icon:block"
        />
      </span>
      <span className="max-w-full px-1 py-0.5 font-pixel text-[8px] leading-tight break-words uppercase group-data-[selected=true]/desktop-icon:bg-foreground group-data-[selected=true]/desktop-icon:text-background">
        {label}
      </span>
    </button>
  )
}

export { DesktopIcon, type DesktopIconProps }
