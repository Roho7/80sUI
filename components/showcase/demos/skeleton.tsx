import { Skeleton } from "@/components/ui/skeleton"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "line", render: () => <Skeleton className="h-4 w-48" /> },
    { label: "block", render: () => <Skeleton className="h-16 w-48" /> },
    {
      label: "card",
      render: () => (
        <div className="flex items-center gap-3">
          <Skeleton className="size-10" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ),
    },
  ],
}
