import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { DocPage } from "@/lib/docs/pages"
import { findNeighbors } from "@/lib/docs/pages"

type PageNeighborsProps = {
  href: string
}

function NeighborLink({ page, label }: { page: DocPage; label: string }) {
  return (
    <Button asChild variant="outline" className="h-auto min-w-0 flex-col items-start gap-1 py-2">
      <Link href={page.href}>
        <span className="text-sm">{label}</span>
        <span className="max-w-full truncate">{page.title}</span>
      </Link>
    </Button>
  )
}

function PageNeighbors({ href }: PageNeighborsProps) {
  const { previous, next } = findNeighbors(href)

  return (
    <nav aria-label="Previous and next page" className="grid grid-cols-2 gap-3">
      <div className="min-w-0 [&>a]:w-full">
        {previous && <NeighborLink page={previous} label="Previous" />}
      </div>
      <div className="min-w-0 text-right [&>a]:w-full [&_a]:items-end">
        {next && <NeighborLink page={next} label="Next" />}
      </div>
    </nav>
  )
}

export { PageNeighbors }
