import { cn } from "cn"
import type { CSSProperties } from "react"

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

function VariantCell({ variant, index }: { variant: ShowcaseVariant; index: number }) {
  return (
    <figure className="flex min-w-0 flex-col gap-3 bg-card p-3 shadow-[0_0_0_var(--pixel)_var(--color-border)]">
      <figcaption className="flex items-center gap-2 font-pixel text-[8px] leading-none uppercase">
        <span className="bg-foreground px-1 py-0.5 text-card">{formatVariantCode(index)}</span>
        {variant.label}
      </figcaption>
      <div className="flex flex-1 flex-col justify-center">{variant.render()}</div>
    </figure>
  )
}

function ShowcaseCard({ entry, index }: ShowcaseCardProps) {
  const { name, title, description, demo } = entry
  const layout = SPAN_LAYOUTS[demo.span]
  const titleId = `showcase-${name}`
  const cellGridStyle: CSSProperties & { "--cell-min": string } = {
    "--cell-min": layout.cellMinWidth,
  }

  return (
    <article
      id={name}
      aria-labelledby={titleId}
      data-span={demo.span}
      className={cn(
        "flex min-w-0 flex-col pixel-border border-border bg-card text-card-foreground offset-shadow-3",
        layout.className
      )}
    >
      <header className="flex h-8 shrink-0 items-center gap-3 border-b-(length:--pixel) border-border bg-titlebar px-3 font-pixel text-[16px] leading-none text-titlebar-foreground uppercase">
        <span aria-hidden="true">{formatCatalogueNumber(index)}</span>
        <h2 id={titleId} className="truncate">
          {title}
        </h2>
        <span aria-hidden="true" className="h-4 min-w-6 flex-1 stripes" />
        <span className="shrink-0 text-[8px]">{demo.variants.length} var.</span>
      </header>
      <div className="flex flex-col gap-3 border-b-(length:--pixel) border-border p-3">
        <p className="text-xl leading-tight">{description}</p>
        <InstallCommand name={name} />
      </div>
      <div
        style={cellGridStyle}
        className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(min(100%,var(--cell-min)),1fr))] gap-(--pixel) overflow-hidden md:auto-rows-fr"
      >
        {demo.variants.map((variant, variantIndex) => (
          <VariantCell key={variant.label} variant={variant} index={variantIndex} />
        ))}
      </div>
    </article>
  )
}

export { ShowcaseCard }
