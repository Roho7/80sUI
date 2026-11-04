import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import type { ShowcaseDemo } from "../types"

const DRIVES = ["A:", "C:", "D:"] as const

function renderGroup(idPrefix: string, options: { isInvalid?: boolean; isDisabled?: boolean; isHorizontal?: boolean }) {
  return (
    <RadioGroup
      defaultValue="C:"
      aria-label="Drive"
      disabled={options.isDisabled}
      className={options.isHorizontal ? "flex flex-wrap gap-5" : undefined}
    >
      {DRIVES.map((drive) => (
        <div key={drive} className="flex items-center gap-3">
          <RadioGroupItem
            id={`${idPrefix}-${drive}`}
            value={drive}
            aria-invalid={options.isInvalid}
            disabled={drive === "A:" && !options.isDisabled ? true : undefined}
          />
          <Label htmlFor={`${idPrefix}-${drive}`}>{drive}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "vertical, A: disabled", render: () => renderGroup("radio-vertical", {}) },
    { label: "horizontal", render: () => renderGroup("radio-horizontal", { isHorizontal: true }) },
    { label: "invalid", render: () => renderGroup("radio-invalid", { isInvalid: true, isHorizontal: true }) },
    { label: "group disabled", render: () => renderGroup("radio-disabled", { isDisabled: true, isHorizontal: true }) },
  ],
}
