import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import type { ShowcaseDemo } from "../types"

function renderSide(side: "top" | "right" | "bottom" | "left", showCloseButton = true) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant={showCloseButton ? "default" : "secondary"} className="self-center">
          {showCloseButton ? side : `${side}, no glyph`}
        </Button>
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Properties</SheetTitle>
          <SheetDescription>Opens in one frame from the {side} edge.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    { label: "right", render: () => renderSide("right") },
    { label: "left", render: () => renderSide("left") },
    { label: "top", render: () => renderSide("top") },
    { label: "bottom", render: () => renderSide("bottom") },
    { label: "no close glyph", render: () => renderSide("right", false) },
  ],
}
