import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { ShowcaseDemo } from "../types"

const SIDES = ["top", "right", "bottom", "left"] as const

export const demo: ShowcaseDemo = {
  span: "single",
  variants: SIDES.map((side) => ({
    label: side,
    render: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" className="self-center">
              Hover
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Click here to begin.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  })),
}
