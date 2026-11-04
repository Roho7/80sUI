import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

import type { ShowcaseDemo } from "../types"

function renderSelect(size: "default" | "sm") {
  return (
    <NativeSelect size={size}>
      <NativeSelectOption value="a">Apple</NativeSelectOption>
      <NativeSelectOption value="b">Banana</NativeSelectOption>
    </NativeSelect>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "default", render: () => renderSelect("default") },
    { label: "sm", render: () => renderSelect("sm") },
    {
      label: "disabled",
      render: () => (
        <NativeSelect disabled>
          <NativeSelectOption value="a">Apple</NativeSelectOption>
        </NativeSelect>
      ),
    },
    {
      label: "invalid",
      render: () => (
        <NativeSelect aria-invalid>
          <NativeSelectOption value="a">Apple</NativeSelectOption>
        </NativeSelect>
      ),
    },
  ],
}
