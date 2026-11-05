"use client"

import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TaskbarProps = React.ComponentProps<"footer"> & {
  startMenu?: React.ReactNode
  startIcon?: React.ReactNode
  startLabel?: string
  startMenuTitle?: string
  clock?: React.ReactNode
}

const CLOCK_REFRESH_MS = 5000

function subscribeClock(onChange: () => void) {
  const interval = window.setInterval(onChange, CLOCK_REFRESH_MS)
  return () => window.clearInterval(interval)
}

function readClock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function readServerClock() {
  return "--:--"
}

function TaskbarClock({ className, ...props }: React.ComponentProps<"span">) {
  const time = React.useSyncExternalStore(subscribeClock, readClock, readServerClock)

  return (
    <span
      data-slot="taskbar-clock"
      className={cn("flex h-7 items-center bevel-sunken offset-shadow-none px-3 text-xl leading-none", className)}
      {...props}
    >
      <time>{time}</time>
    </span>
  )
}

function TaskbarStart({
  icon,
  label,
  title,
  children,
}: {
  icon?: React.ReactNode
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-slot="taskbar-start" variant="default" size="sm">
          {icon}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={6}
        className="flex min-w-56 p-0"
      >
        <span
          aria-hidden="true"
          className="flex w-8 shrink-0 items-end justify-center bg-titlebar py-2 font-pixel text-[16px] leading-none text-titlebar-foreground uppercase [writing-mode:vertical-rl] rotate-180"
        >
          {title}
        </span>
        <div className="flex min-w-0 flex-1 flex-col p-(--pixel)">{children}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Taskbar({
  startMenu,
  startIcon,
  startLabel = "Start",
  startMenuTitle = "nostalgui",
  clock = <TaskbarClock />,
  className,
  children,
  ...props
}: TaskbarProps) {
  return (
    <footer
      data-slot="taskbar"
      className={cn(
        "flex h-11 items-center gap-2 border-t-(length:--pixel) border-border bg-secondary px-2 text-secondary-foreground bevel-raised offset-shadow-none",
        className
      )}
      {...props}
    >
      {startMenu !== undefined && (
        <TaskbarStart icon={startIcon} label={startLabel} title={startMenuTitle}>
          {startMenu}
        </TaskbarStart>
      )}
      <div data-slot="taskbar-tasks" className="flex min-w-0 flex-1 items-center gap-2">
        {children}
      </div>
      {clock}
    </footer>
  )
}

export { Taskbar, TaskbarClock, type TaskbarProps }
