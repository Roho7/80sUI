import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import type { ShowcaseDemo } from "../types"

function renderGroup(
  variant: "default" | "outline",
  size: "default" | "sm" | "lg",
  spacing: number,
  orientation: "horizontal" | "vertical" = "horizontal",
  isDisabled = false
) {
  return (
    <ToggleGroup
      type="single"
      defaultValue="b"
      variant={variant}
      size={size}
      spacing={spacing}
      orientation={orientation}
      disabled={isDisabled}
    >
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "default", render: () => renderGroup("default", "default", 2) },
    { label: "outline joined", render: () => renderGroup("outline", "default", 0) },
    { label: "sm", render: () => renderGroup("outline", "sm", 0) },
    { label: "lg", render: () => renderGroup("outline", "lg", 0) },
    { label: "vertical", render: () => renderGroup("outline", "default", 0, "vertical") },
    { label: "disabled", render: () => renderGroup("outline", "default", 0, "horizontal", true) },
  ],
}
