import { Input } from "@/components/ui/input"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "default", render: () => <Input defaultValue="C:\\AUTOEXEC.BAT" aria-label="Path" /> },
    { label: "placeholder", render: () => <Input placeholder="Type a filename" aria-label="Filename" /> },
    { label: "disabled", render: () => <Input disabled defaultValue="Read only" aria-label="Disabled" /> },
    {
      label: "invalid",
      render: () => <Input aria-invalid defaultValue="CON.TXT" aria-label="Invalid filename" />,
    },
    { label: "file", render: () => <Input type="file" aria-label="Upload" /> },
  ],
}
