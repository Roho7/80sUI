"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import type { DocGroup } from "@/lib/docs/pages"

type DocsSearchProps = {
  groups: readonly DocGroup[]
}

function DocsSearch({ groups }: DocsSearchProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function toggleOnShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", toggleOnShortcut)
    return () => document.removeEventListener("keydown", toggleOnShortcut)
  }, [])

  function openPage(href: string) {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} aria-label="Search documentation">
        <span>Search</span>
        <Kbd className="max-md:hidden">⌘K</Kbd>
      </Button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Search documentation"
        description="Find a guide or component page."
      >
        <CommandInput placeholder="Search pages" />
        <CommandList>
          <CommandEmpty>No pages found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.pages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={`${group.label} ${page.title}`}
                  keywords={[page.description]}
                  onSelect={() => openPage(page.href)}
                >
                  {page.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export { DocsSearch }
