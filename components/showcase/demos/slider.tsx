import { Slider } from "@/components/ui/slider"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    { label: "empty", render: () => <Slider defaultValue={[0]} aria-label="Empty" /> },
    { label: "half", render: () => <Slider defaultValue={[50]} aria-label="Half" /> },
    { label: "full", render: () => <Slider defaultValue={[100]} aria-label="Full" /> },
    { label: "range", render: () => <Slider defaultValue={[20, 80]} aria-label="Range" /> },
    {
      label: "step 25",
      render: () => <Slider defaultValue={[75]} step={25} aria-label="Step 25" />,
    },
    {
      label: "disabled",
      render: () => <Slider defaultValue={[40]} disabled aria-label="Disabled" />,
    },
    {
      label: "vertical",
      render: () => (
        <Slider
          defaultValue={[60]}
          orientation="vertical"
          aria-label="Vertical"
          className="mx-auto data-vertical:min-h-28"
        />
      ),
    },
  ],
}
