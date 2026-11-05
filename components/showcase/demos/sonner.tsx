import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

import type { ShowcaseDemo } from "../types"

const TOASTS: readonly { label: string; fire: () => void }[] = [
  { label: "default", fire: () => toast("Disk inserted", { description: "A:\\ is ready." }) },
  { label: "success", fire: () => toast.success("Saved to floppy") },
  { label: "info", fire: () => toast.info("You have 1 new fax") },
  { label: "warning", fire: () => toast.warning("Low disk space", { description: "312 KB free on C:\\" }) },
  { label: "error", fire: () => toast.error("General protection fault") },
  { label: "loading", fire: () => toast.loading("Defragmenting...") },
  {
    label: "action",
    fire: () =>
      toast("File deleted", {
        action: { label: "Undo", onClick: () => toast.success("File restored") },
        cancel: { label: "OK", onClick: () => {} },
      }),
  },
]

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: TOASTS.map(({ label, fire }, index) => ({
    label,
    render: () => (
      <>
        {index === 0 && <Toaster offset={{ bottom: 64 }} mobileOffset={{ bottom: 64 }} />}
        <Button size="sm" className="self-center" onClick={fire}>
          {label}
        </Button>
      </>
    ),
  })),
}
