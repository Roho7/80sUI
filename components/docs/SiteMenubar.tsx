"use client"

import Link from "next/link"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import type { DocGroup } from "@/lib/docs/pages"
import { SOURCE_URL } from "@/lib/site"

type SiteMenubarProps = {
  guides: DocGroup
  sections: readonly DocGroup[]
  className?: string
}

function SiteMenubar({ guides, sections, className }: SiteMenubarProps) {
  return (
    <Menubar aria-label="Site" className={className}>
      <MenubarMenu>
        <MenubarTrigger>Docs</MenubarTrigger>
        <MenubarContent>
          {guides.pages.map((page) => (
            <MenubarItem key={page.href} asChild>
              <Link href={page.href}>{page.title}</Link>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Components</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link href="/components">Browse all</Link>
          </MenubarItem>
          <MenubarSeparator />
          {sections.map((section) => (
            <MenubarSub key={section.label}>
              <MenubarSubTrigger>{section.label}</MenubarSubTrigger>
              <MenubarSubContent className="max-h-[60vh] overflow-y-auto">
                {section.pages.map((page) => (
                  <MenubarItem key={page.href} asChild>
                    <Link href={page.href}>{page.title}</Link>
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Desktop</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link href="/">Open desktop</Link>
          </MenubarItem>
          <MenubarItem asChild>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              Source on GitHub
            </a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export { SiteMenubar }
