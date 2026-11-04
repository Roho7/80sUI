import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import type { ShowcaseDemo } from "../types"

const LOG_LINES = Array.from(
  { length: 24 },
  (_, index) => `${String(index + 1).padStart(2, "0")} DRV${index}.SYS`
)

const WIDE_ROW = "0x80100000 2bd49666 ntoskrnl.exe ncrc710.sys scsidisk.sys Floppy.SYS atd.sys"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "vertical",
      render: () => (
        <ScrollArea className="h-40 pixel-border border-border bg-card">
          <ul className="p-2 pr-7 text-lg leading-tight">
            {LOG_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </ScrollArea>
      ),
    },
    {
      label: "horizontal",
      render: () => (
        <ScrollArea className="pixel-border border-border bg-card">
          <p className="w-max p-2 pb-7 text-lg whitespace-nowrap">{WIDE_ROW}</p>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ),
    },
    {
      label: "both",
      render: () => (
        <ScrollArea className="h-32 pixel-border border-border bg-card">
          <ul className="w-max p-2 pr-7 pb-7 text-lg leading-tight whitespace-nowrap">
            {LOG_LINES.map((line) => (
              <li key={line}>
                {line} {WIDE_ROW}
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ),
    },
  ],
}
