"use client"

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

type TaskbarProps = {
  onShutDown: () => void
}

function Taskbar({ onShutDown }: TaskbarProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <>
      <RetroTaskbar
        className="absolute inset-x-0 bottom-0 z-30"
        startMenu={
          <>
            <DropdownMenuItem onSelect={() => setIsAboutOpen(true)}>About NOSTALGUI</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/components">Components</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onShutDown}>Shut Down...</DropdownMenuItem>
          </>
        }
      >
        <Button asChild variant="secondary" size="sm">
          <Link href="/components">Components</Link>
        </Button>
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
