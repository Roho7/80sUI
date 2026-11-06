import { cn } from "cn"
import Link from "next/link"
import type { CSSProperties } from "react"

import { Window } from "@/components/retro/window"
import { docHref } from "@/lib/docs/routes"

import { InstallCommand } from "./InstallCommand"
import type { ShowcaseEntry, ShowcaseSpan, ShowcaseVariant } from "./types"

type SpanLayout = {
  className: string
  cellMinWidth: string
}

const SPAN_LAYOUTS: Record<ShowcaseSpan, SpanLayout> = {
  single: { className: "md:col-span-4", cellMinWidth: "10rem" },
  wide: { className: "md:col-span-8", cellMinWidth: "16rem" },
  tall: { className: "md:col-span-4 md:row-span-2", cellMinWidth: "10rem" },
  large: { className: "md:col-span-8 md:row-span-2", cellMinWidth: "16rem" },
  full: { className: "md:col-span-12", cellMinWidth: "26rem" },
}

type ShowcaseCardProps = {
  entry: ShowcaseEntry
  index: number
}

function formatCatalogueNumber(index: number): string {
  return String(index + 1).padStart(2, "0")
}

function formatVariantCode(index: number): string {
  return String.fromCharCode("A".charCodeAt(0) + index)
}

function VariantCell({
  variant,
  index,
  layout,
}: {
  variant: ShowcaseVariant
  index: number
  layout: "wrap" | "stack"
}) {
  return (
    <figure
      className={cn(
        "flex max-w-full min-w-[min(100%,var(--cell-min))] flex-col gap-3 bg-card p-3 shadow-[0_0_0_var(--pixel)_var(--color-border)]",
        layout === "wrap" ? "flex-[1_1_content]" : "w-full shrink-0"
      )}
    >
      <figcaption className="flex items-center gap-2 font-pixel text-sm leading-none uppercase">
        <span className="bg-foreground px-1 py-0.5 text-card">{formatVariantCode(index)}</span>
        {variant.label}
      </figcaption>
      <div className="-mx-3 flex min-w-0 flex-1 flex-col justify-start overflow-x-auto px-3">{variant.render()}</div>
    </figure>
  )
}

function ShowcaseCard({ entry, index }: ShowcaseCardProps) {
  const { name, title, description, demo } = entry
  const layout = SPAN_LAYOUTS[demo.span]
  const cellGridStyle: CSSProperties & { "--cell-min": string } = {
    "--cell-min": layout.cellMinWidth,
  }

  return (
    <Window
      id={name}
      title={`${formatCatalogueNumber(index)} ${title}`}
      data-span={demo.span}
      className={cn("min-w-0", layout.className)}
      statusBar={
        <>
          <Link href={docHref(name)} className="hover:underline">
            Docs
          </Link>
          <span className="ml-auto">{demo.variants.length} variants</span>
        </>
      }
    >
      <div className="flex flex-col gap-3 border-b-(length:--pixel) border-border p-3">
        <p className="text-xl leading-tight">{description}</p>
        <InstallCommand name={name} />
      </div>
      <div
        style={cellGridStyle}
        className={cn(
          "flex min-h-0 flex-1 gap-(--pixel)",
          demo.variantLayout === "stack" ? "flex-col overflow-y-auto" : "flex-wrap overflow-hidden"
        )}
      >
        {demo.variants.map((variant, variantIndex) => (
          <VariantCell
            key={variant.label}
            variant={variant}
            index={variantIndex}
            layout={demo.variantLayout === "stack" ? "stack" : "wrap"}
          />
        ))}
      </div>
    </Window>
  )
}

export { ShowcaseCard, SPAN_LAYOUTS, VariantCell }
