import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "with input",
      render: () => (
        <div className="flex flex-col gap-2">
          <Label htmlFor="label-demo-name">Name</Label>
          <Input id="label-demo-name" defaultValue="GUEST" />
        </div>
      ),
    },
    {
      label: "with checkbox",
      render: () => (
        <div className="flex items-center gap-3">
          <Checkbox id="label-demo-save" defaultChecked />
          <Label htmlFor="label-demo-save">Autosave</Label>
        </div>
      ),
    },
    {
      label: "disabled peer",
      render: () => (
        <div className="flex items-center gap-3">
          <Checkbox id="label-demo-locked" disabled />
          <Label htmlFor="label-demo-locked">Locked</Label>
        </div>
      ),
    },
  ],
}
