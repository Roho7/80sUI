import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import type { ShowcaseDemo } from "../types"

type Direction = "top" | "right" | "bottom" | "left"

function renderDirection(direction: Direction) {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button size="sm" className="self-center">
          {direction}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Insert disk 2</DrawerTitle>
          <DrawerDescription>Drag the drawer back toward the {direction} edge to close it.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Continue</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "bottom", render: () => renderDirection("bottom") },
    { label: "top", render: () => renderDirection("top") },
    { label: "left", render: () => renderDirection("left") },
    { label: "right", render: () => renderDirection("right") },
  ],
}
