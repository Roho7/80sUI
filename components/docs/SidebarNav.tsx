"use client"

import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { DocGroup } from "@/lib/docs/pages"

type SidebarNavProps = {
  groups: readonly DocGroup[]
  onNavigate?: () => void
  className?: string
}

function SidebarNav({ groups, onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-5", className)}>
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-1">
          <h2 className="flex items-center justify-between px-2 font-pixel text-sm leading-none uppercase">
            <span>{group.label}</span>
            {group.isCounted && <span>{group.pages.length}</span>}
          </h2>
          <ul className="flex flex-col">
            {group.pages.map((page) => {
              const isActive = pathname === page.href
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block truncate px-2 py-0.5 text-xl leading-tight hover:bg-muted",
                      isActive && "bg-foreground text-background hover:bg-foreground"
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}

export { SidebarNav }
