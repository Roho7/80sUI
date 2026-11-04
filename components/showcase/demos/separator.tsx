import { Separator } from "@/components/ui/separator"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "horizontal",
      render: () => (
        <div className="flex flex-col gap-3 text-xl">
          <span>Program Manager</span>
          <Separator />
          <span>File Manager</span>
        </div>
      ),
    },
    {
      label: "vertical",
      render: () => (
        <div className="flex h-8 items-center gap-3 text-xl">
          <span>Cut</span>
          <Separator orientation="vertical" />
          <span>Copy</span>
          <Separator orientation="vertical" />
          <span>Paste</span>
        </div>
      ),
    },
  ],
}
