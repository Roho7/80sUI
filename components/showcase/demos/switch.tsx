import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import type { ShowcaseDemo } from "../types"

type SwitchState = {
  label: string
  size: "sm" | "default"
  isChecked: boolean
  isDisabled?: boolean
  isInvalid?: boolean
}

const STATES: readonly SwitchState[] = [
  { label: "off", size: "default", isChecked: false },
  { label: "on", size: "default", isChecked: true },
  { label: "sm off", size: "sm", isChecked: false },
  { label: "sm on", size: "sm", isChecked: true },
  { label: "disabled off", size: "default", isChecked: false, isDisabled: true },
  { label: "disabled on", size: "default", isChecked: true, isDisabled: true },
  { label: "invalid", size: "default", isChecked: false, isInvalid: true },
]

function renderSwitch({ label, size, isChecked, isDisabled, isInvalid }: SwitchState) {
  const id = `switch-${label.replace(/\s/g, "-")}`
  return (
    <div className="flex items-center gap-3">
      <Switch
        id={id}
        size={size}
        defaultChecked={isChecked}
        disabled={isDisabled}
        aria-invalid={isInvalid}
      />
      <Label htmlFor={id}>Turbo</Label>
    </div>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: STATES.map((state) => ({ label: state.label, render: () => renderSwitch(state) })),
}
