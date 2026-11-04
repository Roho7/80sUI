"use client"

import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function subscribeMinute(onChange: () => void) {
  const interval = window.setInterval(onChange, 5000)
  return () => window.clearInterval(interval)
}

function readClock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function readServerClock() {
  return "--:--"
}

function Taskbar() {
  const clock = useSyncExternalStore(subscribeMinute, readClock, readServerClock)

  return (
    <footer className="absolute inset-x-0 bottom-0 z-30 flex h-11 items-center gap-2 border-t-(length:--pixel) border-border bg-secondary px-2 text-secondary-foreground bevel-raised">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            Start
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About dither-ui</DialogTitle>
            <DialogDescription>
              Retro components for shadcn. Real DOM, 1-bit borders, offset shadows and
              ordered-dither images quantized to the theme inks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
      <span className="flex-1" />
      <span className="flex h-7 items-center bevel-sunken px-3 text-xl">{clock}</span>
    </footer>
  )
}

export { Taskbar }
