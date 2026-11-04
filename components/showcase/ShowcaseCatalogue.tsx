"use client"

import { SHOWCASE_ENTRIES } from "./demos.generated"
import { ShowcaseCard } from "./ShowcaseCard"

const VARIANT_COUNT = SHOWCASE_ENTRIES.reduce(
  (total, entry) => total + entry.demo.variants.length,
  0
)

function ShowcaseCatalogue() {
  return (
    <section aria-label="Component catalogue" className="flex flex-col gap-6">
      <p className="flex items-center gap-3 font-pixel text-[16px] leading-none uppercase">
        <span>Catalogue No. 1</span>
        <span aria-hidden="true" className="h-4 min-w-6 flex-1 stripes" />
        <span>
          {SHOWCASE_ENTRIES.length} items / {VARIANT_COUNT} variants
        </span>
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-flow-row-dense md:auto-rows-[minmax(14rem,auto)] md:grid-cols-12">
        {SHOWCASE_ENTRIES.map((entry, index) => (
          <ShowcaseCard key={entry.name} entry={entry} index={index} />
        ))}
      </div>
    </section>
  )
}

export { ShowcaseCatalogue }
