"use client"

import { cn } from "cn"
import Link from "next/link"
import { useState } from "react"

import { Taskbar as RetroTaskbar } from "@/components/retro/taskbar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

type TaskButtonProps = {
  label: string
  isPressed: boolean
  onClick?: () => void
  className?: string
}

function TaskButton({ label, isPressed, onClick, className }: TaskButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      aria-pressed={isPressed}
      onClick={onClick}
      className={cn("min-w-0 max-w-40 justify-start truncate aria-pressed:bevel-sunken aria-pressed:bg-muted", className)}
    >
      <span className="truncate">{label}</span>
    </Button>
  )
}

type TaskbarProps = {
  onShutDown: () => void
  children?: React.ReactNode
}

function Taskbar({ onShutDown, children }: TaskbarProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <>
      <RetroTaskbar
        className="fixed inset-x-0 bottom-0 z-30"
        startMenu={
          <>
            <DropdownMenuItem onSelect={() => setIsAboutOpen(true)}>About NOSTALGUI</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/components">Components</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/docs">Docs</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onShutDown}>Shut Down...</DropdownMenuItem>
          </>
        }
      >
        {children}
      </RetroTaskbar>
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About NOSTALGUI</DialogTitle>
            <DialogDescription>
              Retro components for shadcn. Real DOM, 1-bit borders, offset shadows and
              ordered-dither images quantized to the theme inks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { Taskbar, TaskButton }
