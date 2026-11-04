import { Checkbox } from "@/components/ui/checkbox"

import type { ShowcaseDemo } from "../types"

type CheckboxState = {
  label: string
  checked: boolean | "indeterminate"
  isDisabled: boolean
}

const STATES: readonly CheckboxState[] = [
  { label: "unchecked", checked: false, isDisabled: false },
  { label: "checked", checked: true, isDisabled: false },
  { label: "indeterminate", checked: "indeterminate", isDisabled: false },
  { label: "disabled", checked: false, isDisabled: true },
  { label: "disabled checked", checked: true, isDisabled: true },
]

function renderCheckbox({ label, checked, isDisabled }: CheckboxState) {
  return (
    <label className="flex items-center gap-3 text-xl has-disabled:text-muted-foreground">
      <Checkbox defaultChecked={checked} disabled={isDisabled} />
      Autosave.exe
      <span className="sr-only">{label}</span>
    </label>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: STATES.map((state) => ({ label: state.label, render: () => renderCheckbox(state) })),
}
