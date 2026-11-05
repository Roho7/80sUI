"use client"

import Link from "next/link"
import { useState } from "react"

import { Taskbar as RetroTaskbar } from "@/components/retro/taskbar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { StartLogoGlyph } from "./LogoGlyph"

type TaskbarProps = {
  onShutDown: () => void
  maxVisibleTasks?: number
  children?: React.ReactNode
}

function Taskbar({ onShutDown, maxVisibleTasks, children }: TaskbarProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <>
      <RetroTaskbar
        className="fixed inset-x-0 bottom-0 z-30"
        startIcon={<StartLogoGlyph />}
        maxVisibleTasks={maxVisibleTasks}
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

export { Taskbar }
