import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import type { ShowcaseDemo } from "../types"

function renderCollapsible(defaultOpen: boolean) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="flex flex-col gap-2">
      <CollapsibleTrigger asChild>
        <Button size="sm">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-lg">
        Hidden until the trigger is pressed.
      </CollapsibleContent>
    </Collapsible>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "closed", render: () => renderCollapsible(false) },
    { label: "open", render: () => renderCollapsible(true) },
  ],
}
