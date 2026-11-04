import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import type { ShowcaseDemo } from "../types"

function renderPopover(align: "start" | "center" | "end", label: string) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="self-center">
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align}>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the layer.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

function renderBare() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="secondary" className="self-center">
          Bare
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40">Just text in a box.</PopoverContent>
    </Popover>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "align center", render: () => renderPopover("center", "Open") },
    { label: "align start", render: () => renderPopover("start", "Start") },
    { label: "align end", render: () => renderPopover("end", "End") },
    { label: "plain content", render: renderBare },
  ],
}
