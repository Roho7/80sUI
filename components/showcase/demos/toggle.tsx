import { Toggle } from "@/components/ui/toggle"

import type { ShowcaseDemo } from "../types"

type ToggleState = {
  label: string
  variant: "default" | "outline"
  size: "default" | "sm" | "lg"
  isPressed?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
}

const STATES: readonly ToggleState[] = [
  { label: "default", variant: "default", size: "default" },
  { label: "default pressed", variant: "default", size: "default", isPressed: true },
  { label: "outline", variant: "outline", size: "default" },
  { label: "outline pressed", variant: "outline", size: "default", isPressed: true },
  { label: "sm", variant: "outline", size: "sm" },
  { label: "lg", variant: "outline", size: "lg" },
  { label: "disabled", variant: "outline", size: "default", isDisabled: true },
  { label: "invalid", variant: "outline", size: "default", isInvalid: true },
]

export const demo: ShowcaseDemo = {
  span: "single",
  variants: STATES.map((state) => ({
    label: state.label,
    render: () => (
      <Toggle
        variant={state.variant}
        size={state.size}
        defaultPressed={state.isPressed}
        disabled={state.isDisabled}
        aria-invalid={state.isInvalid}
      >
        Bold
      </Toggle>
    ),
  })),
}
