import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import type { ShowcaseDemo } from "../types"

function renderHoverCard(align: "start" | "center" | "end", label: string) {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Button size="sm" variant="link" className="self-center">
          {label}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align={align}>
        <p className="font-pixel text-[12px] uppercase">UI95</p>
        <p className="text-lg leading-tight text-muted-foreground">One bit, four inks, zero tweens.</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "align center", render: () => renderHoverCard("center", "@ui95") },
    { label: "align start", render: () => renderHoverCard("start", "@start") },
    { label: "align end", render: () => renderHoverCard("end", "@end") },
  ],
}
