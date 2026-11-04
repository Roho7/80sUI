import { Textarea } from "@/components/ui/textarea"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "default",
      render: () => <Textarea defaultValue={"Dear diary,\nThe printer jammed again."} aria-label="Diary" />,
    },
    { label: "placeholder", render: () => <Textarea placeholder="Leave a note" aria-label="Note" /> },
    { label: "disabled", render: () => <Textarea disabled defaultValue="Locked" aria-label="Locked" /> },
    { label: "invalid", render: () => <Textarea aria-invalid defaultValue="???" aria-label="Invalid" /> },
  ],
}
