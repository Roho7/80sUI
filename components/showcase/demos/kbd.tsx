import { Kbd, KbdGroup } from "@/components/ui/kbd"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "key", render: () => <Kbd>Esc</Kbd> },
    {
      label: "group",
      render: () => (
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span className="text-lg">+</span>
          <Kbd>Alt</Kbd>
          <span className="text-lg">+</span>
          <Kbd>Del</Kbd>
        </KbdGroup>
      ),
    },
    {
      label: "in text",
      render: () => (
        <p className="text-lg">
          Press <Kbd>F1</Kbd> for help
        </p>
      ),
    },
  ],
}
