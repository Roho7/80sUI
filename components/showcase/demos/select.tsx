import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { ShowcaseDemo } from "../types"

type SelectSetting = {
  label: string
  size: "sm" | "default"
  defaultValue?: string
  isDisabled?: boolean
  isInvalid?: boolean
  isGrouped?: boolean
}

const SETTINGS: readonly SelectSetting[] = [
  { label: "default", size: "default", defaultValue: "vga" },
  { label: "placeholder", size: "default" },
  { label: "sm", size: "sm", defaultValue: "ega" },
  { label: "groups, disabled item", size: "default", defaultValue: "svga", isGrouped: true },
  { label: "invalid", size: "default", defaultValue: "cga", isInvalid: true },
  { label: "disabled", size: "default", defaultValue: "vga", isDisabled: true },
]

function renderFlatItems() {
  return (
    <>
      <SelectItem value="cga">CGA 4 colors</SelectItem>
      <SelectItem value="ega">EGA 16 colors</SelectItem>
      <SelectItem value="vga">VGA 256 colors</SelectItem>
      <SelectItem value="svga">SVGA 800x600</SelectItem>
    </>
  )
}

function renderGroupedItems() {
  return (
    <>
      <SelectGroup>
        <SelectLabel>Color</SelectLabel>
        <SelectItem value="cga">CGA 4 colors</SelectItem>
        <SelectItem value="ega">EGA 16 colors</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Resolution</SelectLabel>
        <SelectItem value="svga">SVGA 800x600</SelectItem>
        <SelectItem value="xga" disabled>
          XGA 1024x768
        </SelectItem>
      </SelectGroup>
    </>
  )
}

function renderSelect({ label, size, defaultValue, isDisabled, isInvalid, isGrouped }: SelectSetting) {
  return (
    <Select defaultValue={defaultValue} disabled={isDisabled}>
      <SelectTrigger size={size} aria-label={`Display, ${label}`} aria-invalid={isInvalid} className="w-full">
        <SelectValue placeholder="Pick a display" />
      </SelectTrigger>
      <SelectContent>{isGrouped ? renderGroupedItems() : renderFlatItems()}</SelectContent>
    </Select>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: SETTINGS.map((setting) => ({ label: setting.label, render: () => renderSelect(setting) })),
}
