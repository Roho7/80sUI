"use client"

import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { DocGroup } from "@/lib/docs/pages"

import { Plate } from "../ui/plate"

type SidebarNavProps = {
  groups: readonly DocGroup[]
  onNavigate?: () => void
  className?: string
}

function SidebarNav({ groups, onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-5 bg-card text-foreground", className)}>
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-1">
          <Plate variant='tag' className="flex justify-between">
            <h2 className="flex items-center justify-between px-2 font-pixel text-sm leading-none uppercase">
              <span>{group.label}</span>
            </h2>
          </Plate>
          <ul className="flex flex-col px-3">
            {group.pages.map((page) => {
              const isActive = pathname === page.href
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    data-sound="menu"
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
