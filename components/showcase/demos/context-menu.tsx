import { useState } from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import type { ShowcaseDemo } from "../types"

function renderTrigger() {
  return (
    <ContextMenuTrigger className="flex h-16 w-full items-center justify-center pixel-border border-border bg-card font-pixel text-sm uppercase">
      Right click here
    </ContextMenuTrigger>
  )
}

function renderItemsMenu() {
  return (
    <ContextMenu>
      {renderTrigger()}
      <ContextMenuContent>
        <ContextMenuLabel>Document</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuItem>
            New
            <ContextMenuShortcut>Ctrl+N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Open...
            <ContextMenuShortcut>Ctrl+O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Save
            <ContextMenuShortcut>Ctrl+S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Print preview</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function SelectionMenu() {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true)
  const [isGridVisible, setIsGridVisible] = useState(false)
  const [zoom, setZoom] = useState("100")

  return (
    <ContextMenu>
      {renderTrigger()}
      <ContextMenuContent>
        <ContextMenuCheckboxItem checked={isStatusBarVisible} onCheckedChange={setIsStatusBarVisible}>
          Status bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={isGridVisible} onCheckedChange={setIsGridVisible}>
          Grid
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>Zoom</ContextMenuLabel>
        <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="400">400%</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function renderSubmenu() {
  return (
    <ContextMenu>
      {renderTrigger()}
      <ContextMenuContent>
        <ContextMenuItem>Defragment</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Accessories</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Calculator</ContextMenuItem>
            <ContextMenuItem>Notepad</ContextMenuItem>
            <ContextMenuItem>Paint</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Shut down...</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "items, shortcuts, disabled, inset, destructive", render: renderItemsMenu },
    { label: "checkbox and radio", render: () => <SelectionMenu /> },
    { label: "submenu", render: renderSubmenu },
  ],
}
