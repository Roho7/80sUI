import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { ShowcaseDemo } from "../types"

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"

const VARIANTS: readonly ButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
]

const TEXT_SIZES = [
  { size: "xs", label: "XS" },
  { size: "sm", label: "SM" },
  { size: "default", label: "MD" },
  { size: "lg", label: "LG" },
] as const

const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const

function renderSizes(variant: ButtonVariant) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {TEXT_SIZES.map(({ size, label }) => (
          <Button key={size} variant={variant} size={size}>
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {ICON_SIZES.map((size) => (
          <Button key={size} variant={variant} size={size} aria-label={`${variant} ${size}`}>
            <Plus shapeRendering="crispEdges" strokeWidth={3} />
          </Button>
        ))}
      </div>
    </div>
  )
}

function renderDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} size="sm" disabled>
          {variant}
        </Button>
      ))}
    </div>
  )
}

export const demo: ShowcaseDemo = {
  span: "large",
  variants: [
    ...VARIANTS.map((variant) => ({ label: variant, render: () => renderSizes(variant) })),
    { label: "disabled", render: renderDisabled },
  ],
}
