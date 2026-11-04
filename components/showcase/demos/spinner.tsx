import { Spinner } from "@/components/ui/spinner"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "default", render: () => <Spinner /> },
    { label: "large", render: () => <Spinner className="size-8" /> },
    { label: "muted", render: () => <Spinner className="text-muted-foreground" /> },
  ],
}
