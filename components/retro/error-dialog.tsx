"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { ErrorGlyph } from "@/components/ui/pixel-glyphs"

type ErrorDialogProps = {
  message: React.ReactNode
  title?: string
  actionLabel?: string
  cascadeIndex?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  container?: HTMLElement | null
}

type ErrorEntry = {
  id: string
  message: React.ReactNode
  title?: string
}

type ErrorDialogStackProps = {
  errors: readonly ErrorEntry[]
  onDismiss: (id: string) => void
  container?: HTMLElement | null
}

const CASCADE_STEP_PIXELS = 12

function preventOutsideDismiss(event: Event) {
  event.preventDefault()
}

function readCascadeTranslate(cascadeIndex: number): string {
  const offset = `${cascadeIndex} * var(--pixel) * ${CASCADE_STEP_PIXELS}`
  return `calc(-50% + ${offset}) calc(-50% + ${offset})`
}

function ErrorDialog({
  message,
  title = "Error",
  actionLabel = "OK",
  cascadeIndex = 0,
  open = true,
  onOpenChange,
  container,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        data-slot="error-dialog"
        container={container}
        className="w-80 gap-5 sm:max-w-80"
        style={{ translate: readCascadeTranslate(cascadeIndex) }}
        onInteractOutside={preventOutsideDismiss}
      >
        <DialogTitle>{title}</DialogTitle>
        <div className="flex items-center gap-4 px-1">
          <ErrorGlyph />
          <DialogDescription>{message}</DialogDescription>
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button className="min-w-28">{actionLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ErrorDialogStack({ errors, onDismiss, container }: ErrorDialogStackProps) {
  return errors.map((error, index) => (
    <ErrorDialog
      key={error.id}
      title={error.title}
      message={error.message}
      cascadeIndex={index}
      container={container}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss(error.id)
        }
      }}
    />
  ))
}

export {
  ErrorDialog,
  type ErrorDialogProps,
  ErrorDialogStack,
  type ErrorDialogStackProps,
  type ErrorEntry,
}
