import { cn } from "cn"
import type * as React from "react"

type DocSectionProps = {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

function DocSection({ id, title, children, className }: DocSectionProps) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className={cn("flex flex-col gap-3", className)}>
      <h2
        id={headingId}
        className="flex items-center gap-3 font-pixel text-[20px] leading-none uppercase"
      >
        <span>{title}</span>
        <span aria-hidden="true" className="h-4 min-w-6 flex-1 stripes" />
      </h2>
      {children}
    </section>
  )
}

export { DocSection }
