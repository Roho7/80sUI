"use client"

import {
  Brush,
  Circle,
  Eraser,
  Lasso,
  PaintBucket,
  Pencil,
  Pipette,
  Slash,
  Spline,
  SprayCan,
  Square,
  SquareDashed,
  Type,
  ZoomIn,
} from "lucide-react"
import { useState } from "react"

import { Window, type WindowProps } from "@/components/retro/window"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DitherImage } from "@/components/ui/dither-image"
import { Slider } from "@/components/ui/slider"
import type { BayerMatrixSize } from "@/lib/dither/bayer"

type PaintWindowProps = Pick<WindowProps, "isActive" | "onActivate" | "style">

const MENU_ITEMS = ["File", "Edit", "View", "Image", "Options", "Help"] as const

const TOOLS = [
  { label: "Free select", icon: Lasso },
  { label: "Select", icon: SquareDashed },
  { label: "Eraser", icon: Eraser },
  { label: "Fill", icon: PaintBucket },
  { label: "Pick color", icon: Pipette },
  { label: "Magnify", icon: ZoomIn },
  { label: "Pencil", icon: Pencil },
  { label: "Brush", icon: Brush },
  { label: "Airbrush", icon: SprayCan },
  { label: "Text", icon: Type },
  { label: "Line", icon: Slash },
  { label: "Curve", icon: Spline },
  { label: "Rectangle", icon: Square },
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
      title="untitled - Paint"
      defaultPosition={{ x: 500, y: 28 }}
      className="w-[580px]"
      statusBar={<span>For Help, click Help Topics on the Help Menu.</span>}
      {...windowProps}
    >
      <nav className="flex gap-4 border-b-(length:--pixel) border-border px-3 py-1 text-xl leading-none">
        {MENU_ITEMS.map((item) => (
          <span key={item}>
            <span className="underline decoration-[length:var(--pixel)]">{item[0]}</span>
            {item.slice(1)}
          </span>
        ))}
      </nav>
      <div className="flex gap-2 p-2">
        <div className="grid h-fit grid-cols-2 gap-(--pixel) pixel-border border-border p-(--pixel)">
          {TOOLS.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant="secondary"
              size="icon-sm"
              aria-label={label}
              aria-pressed={activeTool === label}
              className="aria-pressed:bevel-sunken aria-pressed:bg-muted"
              onClick={() => setActiveTool(label)}
            >
              <Icon shapeRendering="crispEdges" strokeWidth={2} />
            </Button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden pixel-border border-border bg-muted p-2">
          <DitherImage
            src="/eye.png"
            alt="A dithered close-up of an eye"
            width={448}
            height={280}
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
