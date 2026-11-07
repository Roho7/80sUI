import { Slider } from "@/components/ui/slider"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    { label: "regular", render: () => <Slider defaultValue={[50]} aria-label="Regular" /> },
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
