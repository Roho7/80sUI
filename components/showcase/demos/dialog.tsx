import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { ShowcaseDemo } from "../types"

function renderTitleBarClose() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="self-center">
          Open
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Readme.txt</DialogTitle>
          <DialogDescription>
            Close with the glyph in the title bar, the Escape key or a click on the overlay.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function renderFooterClose() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="self-center">
          Open
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Tip of the day</DialogTitle>
          <DialogDescription>Save often. The disk is full of surprises.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

function renderConfirm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive" className="self-center">
          Format C:
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>All data on drive C: will be lost. Proceed?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Yes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    { label: "title bar close", render: renderTitleBarClose },
    { label: "footer close", render: renderFooterClose },
    { label: "confirm", render: renderConfirm },
  ],
}
