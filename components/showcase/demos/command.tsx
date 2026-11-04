"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DocumentGlyph,
  FolderGlyph,
  TerminalGlyph,
} from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

function Palette({ initial = "" }: { initial?: string }) {
  const [search, setSearch] = React.useState(initial)
  return (
    <Command className="h-auto">
      <CommandInput
        placeholder="Search disk..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No file found.</CommandEmpty>
        <CommandGroup heading="Files">
          <CommandItem>
            <DocumentGlyph className="size-4" />
            README.TXT
            <CommandShortcut>^O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FolderGlyph className="size-4" />
            GAMES
            <CommandShortcut>^G</CommandShortcut>
          </CommandItem>
          <CommandItem disabled>
            <DocumentGlyph className="size-4" />
            VIRUS.EXE
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="System">
          <CommandItem>
            <TerminalGlyph className="size-4" />
            Dial modem
            <CommandShortcut>^D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <TerminalGlyph className="size-4" />
            Format floppy
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function DialogPalette() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Run a command..." />
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Run">
              <CommandItem onSelect={() => setOpen(false)}>
                <TerminalGlyph className="size-4" />
                Dial modem
                <CommandShortcut>^D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <FolderGlyph className="size-4" />
                Open A:\
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    { label: "palette", render: () => <Palette /> },
    { label: "empty", render: () => <Palette initial="zzz" /> },
    { label: "dialog", render: () => <DialogPalette /> },
  ],
}
