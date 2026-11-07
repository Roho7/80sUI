"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { DocGroup } from "@/lib/docs/pages"
import { SITE_LINKS } from "@/lib/docs/site-links"

import { SidebarNav } from "./SidebarNav"

type MobileNavProps = {
  groups: readonly DocGroup[]
}

function MobileNav({ groups }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden" aria-label="Open navigation">
          <Menu shapeRendering="crispEdges" strokeWidth={3} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0">
        <SheetTitle>Navigation</SheetTitle>
        <SheetDescription className="sr-only">Site links and every documentation page.</SheetDescription>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-5 p-3">
            <ul className="flex flex-col md:hidden">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-sound="menu"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-0.5 text-xl leading-tight hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SidebarNav groups={groups} onNavigate={() => setIsOpen(false)} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
