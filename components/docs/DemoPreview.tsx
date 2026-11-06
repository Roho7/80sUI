"use client"

import { cn } from "cn"
import type { CSSProperties } from "react"

import { SHOWCASE_ENTRIES } from "@/components/showcase/demos.generated"
import { SPAN_LAYOUTS, VariantCell } from "@/components/showcase/ShowcaseCard"

const ENTRIES_BY_NAME = new Map(SHOWCASE_ENTRIES.map((entry) => [entry.name, entry]))

type DemoPreviewProps = {
  name: string
}

function DemoVariants({ name }: DemoPreviewProps) {
  const entry = ENTRIES_BY_NAME.get(name)
  if (!entry) {
    return null
  }
  const style: CSSProperties & { "--cell-min": string } = {
    "--cell-min": SPAN_LAYOUTS[entry.demo.span].cellMinWidth,
  }
  const cellLayout = entry.demo.variantLayout === "stack" ? "stack" : "wrap"

  return (
    <div
      style={style}
      className={cn(
        "flex min-h-0 gap-(--pixel) overflow-hidden pixel-border border-border bg-card",
        cellLayout === "stack" ? "flex-col overflow-y-auto" : "flex-wrap"
      )}
    >
      {entry.demo.variants.map((variant, index) => (
        <VariantCell key={variant.label} variant={variant} index={index} layout={cellLayout} />
      ))}
    </div>
  )
}

function DemoThumbnail({ name }: DemoPreviewProps) {
  const variant = ENTRIES_BY_NAME.get(name)?.demo.variants[0]
  return variant ? variant.render() : null
}

function VariantCount() {
  return SHOWCASE_ENTRIES.reduce((total, entry) => total + entry.demo.variants.length, 0)
}

export { DemoThumbnail, DemoVariants, VariantCount }
