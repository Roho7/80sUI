import { useState } from "react"

import { DesktopIcon } from "@/components/retro/desktop-icon"
import { DocumentGlyph, FolderGlyph, TerminalGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

const ICONS = [
  { label: "My Files", icon: <FolderGlyph /> },
  { label: "Readme.txt", icon: <DocumentGlyph /> },
  { label: "Terminal", icon: <TerminalGlyph /> },
] as const

function IconGrid() {
  const [selectedLabel, setSelectedLabel] = useState<string | null>("My Files")
  const [openedLabel, setOpenedLabel] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 bg-desktop p-2">
        {ICONS.map(({ label, icon }) => (
          <DesktopIcon
            key={label}
            label={label}
            icon={icon}
            isSelected={selectedLabel === label}
            onSelect={() => setSelectedLabel(label)}
            onOpen={() => setOpenedLabel(label)}
          />
        ))}
      </div>
      <p className="text-lg" aria-live="polite">
        {openedLabel ? `Opened ${openedLabel}` : "Double click to open"}
      </p>
    </div>
  )
}

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    { label: "select and open", render: () => <IconGrid /> },
    {
      label: "unselected",
      render: () => <DesktopIcon label="Recycle Bin" icon={<FolderGlyph />} className="self-center" />,
    },
    {
      label: "selected",
      render: () => <DesktopIcon label="Recycle Bin" icon={<FolderGlyph />} isSelected className="self-center" />,
    },
    {
      label: "disabled",
      render: () => <DesktopIcon label="Network" icon={<TerminalGlyph />} disabled className="self-center" />,
    },
  ],
}
