"use client"

import {
  ArtText,
  Circle,
  ColorsSwatch,
  Delete,
  DragAndDrop,
  Drop,
  Edit,
  Frame,
  Minus,
  PaintBucket,
  Section,
  Timeline,
  Wind,
  ZoomIn,
} from "@nsmr/pixelart-react"
import { useState } from "react"

import { Window } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DitherImage } from "@/components/ui/dither-image"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Slider } from "@/components/ui/slider"
import type { BayerMatrixSize } from "@/lib/dither/bayer"

import type { DesktopWindowProps } from "./types"

type PaintWindowProps = DesktopWindowProps

type MenuItem = { label: string; shortcut?: string }

const MENUS: readonly { label: string; items: readonly MenuItem[] }[] = [
  {
    label: "File",
    items: [
      { label: "New", shortcut: "Ctrl+N" },
      { label: "Open...", shortcut: "Ctrl+O" },
      { label: "Save", shortcut: "Ctrl+S" },
      { label: "Exit" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "Ctrl+Z" },
      { label: "Repeat", shortcut: "F4" },
      { label: "Select All", shortcut: "Ctrl+L" },
    ],
  },
  { label: "View", items: [{ label: "Tool Box" }, { label: "Color Box" }, { label: "Status Bar" }] },
  { label: "Image", items: [{ label: "Flip/Rotate..." }, { label: "Invert Colors" }, { label: "Clear Image" }] },
  { label: "Options", items: [{ label: "Edit Colors..." }, { label: "Draw Opaque" }] },
  { label: "Help", items: [{ label: "Help Topics" }, { label: "About Paint" }] },
]

const TOOLS = [
  { label: "Free select", icon: DragAndDrop },
  { label: "Select", icon: Section },
  { label: "Eraser", icon: Delete },
  { label: "Fill", icon: PaintBucket },
  { label: "Pick color", icon: ColorsSwatch },
  { label: "Magnify", icon: ZoomIn },
  { label: "Pencil", icon: Edit },
  { label: "Brush", icon: Drop },
  { label: "Airbrush", icon: Wind },
  { label: "Text", icon: ArtText },
  { label: "Line", icon: Minus },
  { label: "Curve", icon: Timeline },
  { label: "Rectangle", icon: Frame },
  { label: "Ellipse", icon: Circle },
] as const

const SWATCHES = [
  "bg-ink-0",
  "bg-ink-1",
  "bg-ink-2",
  "bg-ink-3",
  "bg-desktop",
  "bg-ink-0 dither-75",
  "bg-ink-0 dither-50",
  "bg-ink-0 dither-25",
] as const

const MATRIX_SIZES: readonly BayerMatrixSize[] = [4, 8]

function PaintWindow(windowProps: PaintWindowProps) {
  const [activeTool, setActiveTool] = useState<string>("Pencil")
  const [matrixSize, setMatrixSize] = useState<BayerMatrixSize>(4)
  const [contrast, setContrast] = useState(1.3)
  const [isAnimated, setIsAnimated] = useState(false)

  return (
    <Window
      statusBar={<span>For Help, click Help Topics on the Help Menu.</span>}
      {...windowProps}
    >
      <Menubar>
        {MENUS.map(({ label, items }) => (
          <MenubarMenu key={label}>
            <MenubarTrigger>{label}</MenubarTrigger>
            <MenubarContent>
              {items.map(({ label: itemLabel, shortcut }) => (
                <MenubarItem key={itemLabel}>
                  {itemLabel}
                  {shortcut && <MenubarShortcut>{shortcut}</MenubarShortcut>}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
      <div className="flex gap-2 p-2">
        <div className="grid h-fit grid-cols-2 gap-(--pixel) pixel-border border-border p-(--pixel)">
          {TOOLS.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant="secondary"
              size="icon"
              aria-label={label}
              aria-pressed={activeTool === label}
              className="aria-pressed:bevel-sunken aria-pressed:bg-muted"
              onClick={() => setActiveTool(label)}
            >
              <Icon className="size-6 fill-current" aria-hidden="true" />
            </Button>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden pixel-border border-border bg-muted p-2">
          <DitherImage
            src="/eye1.png"
            alt="A dithered close-up of an eye"
            width={448}
            height={350}
            matrixSize={matrixSize}
            contrast={contrast}
            isAnimated={isAnimated}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t-(length:--pixel) border-border px-3 py-2">
        <div className="flex gap-(--pixel) pixel-border border-border p-(--pixel)">
          {SWATCHES.map((swatch) => (
            <span key={swatch} aria-hidden="true" className="size-5 bg-ink-3">
              <span className={`block size-full ${swatch}`} />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {MATRIX_SIZES.map((size) => (
            <Button
              key={size}
              size="sm"
              variant={matrixSize === size ? "default" : "outline"}
              aria-pressed={matrixSize === size}
              onClick={() => setMatrixSize(size)}
            >
              {size}x{size}
            </Button>
          ))}
        </div>
        <label className="flex min-w-36 flex-1 items-center gap-2 text-lg">
          Contrast
          <Slider
            min={0.6}
            max={2.4}
            step={0.1}
            value={[contrast]}
            onValueChange={([next]) => setContrast(next)}
            aria-label="Contrast"
          />
        </label>
        <label className="flex items-center gap-2 text-lg">
          <Checkbox
            checked={isAnimated}
            onCheckedChange={(checked) => setIsAnimated(checked === true)}
          />
          Reseed
        </label>
      </div>
    </Window>
  )
}

export { PaintWindow }
